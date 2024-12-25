/*!
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.dev/license
 */

export default {
  production: true,
  // Those values are publicly visible in the search request headers, and presents search-only keys.
  // https://www.algolia.com/doc/guides/security/api-keys/#search-only-api-key
  algolia: {
    appId: 'L1XWT2UJ7F',
    apiKey: 'dfca7ed184db27927a512e5c6668b968',
    indexName: 'angular_v17',
  },
  googleAnalyticsId: 'G-XB6NEVW32B',
  firebase: {
    apiKey: 'AIzaSyDZzqkDi-RE_DHPt_epi1AoLpupEY4h4Gc',
    authDomain: 'taskflow-8bb3e.firebaseapp.com',
    projectId: 'taskflow-8bb3e',
    storageBucket: 'taskflow-8bb3e.appspot.com',
    messagingSenderId: '700858545956',
    appId: '1:700858545956:web:87f9f70d689d05ae8325b1',
    measurementId: 'G-ZHEGTKN1TX',
  },
};
