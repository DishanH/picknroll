// The file contents for the current environment will overwrite these during build.
// The build system defaults to the dev environment which uses `environment.ts`, but if you do
// `ng build --env=prod` then `environment.prod.ts` will be used instead.
// The list of which env maps to which file can be found in `.angular-cli.json`.

export const environment = {
  production: false,
  firebase: {
    apiKey: "AIzaSyBCfiSaYl_omUfCjYh9f1Dar21k9GE0AL8",
    authDomain: "picknroll-web.firebaseapp.com",
    databaseURL: "https://picknroll-web-default-rtdb.firebaseio.com",
    projectId: "picknroll-web",
    storageBucket: "picknroll-web.appspot.com",
    messagingSenderId: "984788430568",
    appId: "1:984788430568:web:0c3f6a43d68aa34167e35d",
    measurementId: "G-HHDZSK8Q72"
  }
  // firebase: {
  //   apiKey: 'AIzaSyCXVTjTuBUXf-UWlpKfKHjomfPezutmPwI',
  //   authDomain: 'cas-fee-shop.firebaseapp.com',
  //   databaseURL: 'https://cas-fee-shop.firebaseio.com',
  //   projectId: 'cas-fee-shop',
  //   storageBucket: 'cas-fee-shop.appspot.com',
  //   messagingSenderId: '323643286137'
  // }
};
