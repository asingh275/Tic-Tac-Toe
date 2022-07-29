import React from "react";
import ReactDOM from "react-dom";
import App from "./App";

import { GoogleOAuthProvider } from "@react-oauth/google";

const clientId =
  "974072486977-icarvdee18po3g9423ctouu8fldv3q3e.apps.googleusercontent.com";

ReactDOM.render(
  <GoogleOAuthProvider clientId={clientId}>
    <App />
  </GoogleOAuthProvider>,
  document.getElementById("root")
);
