package keywords

import (
	"context"
	"fmt"
	"net/http"
	"os"

	"github.com/GoogleCloudPlatform/functions-framework-go/functions"
	"github.com/google/generative-ai-go/genai"
	"google.golang.org/api/option"
)

func init() {
	functions.HTTP("GetKeywords", GetKeywords)
}

func GetKeywords(w http.ResponseWriter, r *http.Request) {
	if r.Method == http.MethodOptions {
		w.Header().Set("Access-Control-Allow-Origin", "*")
		w.WriteHeader(http.StatusNoContent)
		return
	}
	ctx := context.Background()
	client, err := genai.NewClient(ctx, option.WithAPIKey(os.Getenv("APIKEY")))
	if err != nil {
		http.Error(w, "Error creating client", http.StatusInternalServerError)
		return
	}
	defer client.Close()

	model := client.GenerativeModel("gemini-1.5-flash")
	model.ResponseMIMEType = "application/json"
	model.ResponseSchema = &genai.Schema{
		Type:  genai.TypeArray,
		Items: &genai.Schema{Type: genai.TypeString},
	}
	resp, err := model.GenerateContent(ctx, genai.Text(fmt.Sprintf("List max. 3 keywords for \"%s\" using this JSON schema.", r.URL.Query().Get("ai"))))
	if err != nil {
		http.Error(w, "Error making request", http.StatusInternalServerError)
		return
	}

	for _, part := range resp.Candidates[0].Content.Parts {
		if txt, ok := part.(genai.Text); ok {
			w.Header().Set("Content-Type", "application/json")
			w.Header().Set("Access-Control-Allow-Origin", "*")
			w.WriteHeader(http.StatusOK)
			if _, err := w.Write([]byte(txt)); err != nil {
				http.Error(w, "Error writing response", http.StatusInternalServerError)
				return
			}
		}
	}
}

// Your AI is ready to Go. :)
