import React, { StrictMode } from "react";
import ReactDOM from "react-dom";

import "draft-js/dist/Draft.css";

import "./index.css";

import App from "./App";
import * as serviceWorker from "./serviceWorker";
import Providers from "./Providers";

ReactDOM.render(
  <StrictMode>
    <Providers>
      <App />
    </Providers>
  </StrictMode>,
  document.getElementById("root")
);

/*
 * If you want your app to work offline and load faster, you can change
 * unregister() to register() below. Note this comes with some pitfalls.
 * Learn more about service workers: http://bit.ly/CRA-PWA
 */
serviceWorker.unregister();
