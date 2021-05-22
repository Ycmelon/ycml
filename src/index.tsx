import React from "react";
import ReactDOM from "react-dom";
import * as serviceWorker from "./serviceWorker";

import App from "./App";
import "./index.css";
import "@fontsource/roboto";

import firebase from "firebase/app";

firebase.initializeApp({
  apiKey: "AIzaSyBS89pgAPxfaysUA-b4_OlwrIkVKI9_xd8",
  authDomain: "ycmlml.firebaseapp.com",
  projectId: "ycmlml",
  storageBucket: "ycmlml.appspot.com",
  messagingSenderId: "569534126980",
  appId: "1:569534126980:web:f0519116a140ed29445bd1",
  measurementId: "G-F4MSJC4D0K",
});

ReactDOM.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
  document.getElementById("root")
);

serviceWorker.unregister();
