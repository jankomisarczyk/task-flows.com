/*!
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.dev/license
 */

import sdPolygon from './modules/sdf-primitives/sd-polygon.glsl';

const vertex = /* glsl */ `
attribute vec3 position;
attribute vec2 uv;

uniform mat4 modelViewMatrix;
uniform mat4 projectionMatrix;

varying vec2 vUv;

void main() {
  vUv = uv;

  gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
}
`;

const fragment = /* glsl */ `
precision highp float;

uniform vec3 uColor;
uniform float uProgress;
uniform float uAlpha;

varying vec2 vUv;

#define MAX_NUM_VERTICES 5

${sdPolygon}

void main() {
  // Polygon animation
  vec2[MAX_NUM_VERTICES] bottom;
  bottom[0] = vec2(1.0 - 0.685, 0.3);
  bottom[1] = vec2(1.0 - 0.835, 0.356);
  bottom[2] = vec2(1.0 - 0.95, 0.55);
  bottom[3] = vec2(1.0 - 0.92, 0.7);

  vec2[MAX_NUM_VERTICES] right;
  right[0] = vec2(0.65, 1.0 - 0.0);
  right[1] = vec2(0.76, 0.9);
  right[2] = vec2(0.24,  0.9);
  right[3] = vec2(0.35, 1.0 - 0.0);

  vec2[MAX_NUM_VERTICES] left;
  left[0] = vec2(0.685, 0.3);
  left[1] = vec2(0.835, 0.356);
  left[2] = vec2(0.95, 0.55);
  left[3] = vec2(0.92, 0.7);

  float sdBottom = sdPolygon(vUv, bottom, 4);
  float sdRight = sdPolygon(vUv, right, 4);
  float sdLeft = sdPolygon(vUv, left, 4);

  // Anti-alias
  float dBottom = fwidth(sdBottom);
  float alphaBottom = smoothstep(dBottom, -dBottom, sdBottom);
  float dRight = fwidth(sdRight);
  float alphaRight = smoothstep(dRight, -dRight, sdRight);
  float dLeft = fwidth(sdLeft);
  float alphaLeft = smoothstep(dLeft, -dLeft, sdLeft);

  float alpha = max(alphaBottom, alphaRight);
  alpha = max(alpha, alphaLeft);
  alpha *= uAlpha;

  if (alpha < 0.01) {
    discard;
  }

  gl_FragColor.rgb = uColor;
  gl_FragColor.a = alpha;
}
`;

export default {
  vertex100: vertex,

  fragment100: /* glsl */ `#extension GL_OES_standard_derivatives : enable
precision highp float;
${fragment}`,

  vertex300: /* glsl */ `#version 300 es
#define attribute in
#define varying out
${vertex}`,

  fragment300: /* glsl */ `#version 300 es
precision highp float;
#define varying in
#define texture2D texture
#define gl_FragColor FragColor
out vec4 FragColor;
${fragment}`,
};
