import React from "react";
import ReactDOM from "react-dom";
import App from "./App";
import Providers from "./Providers";

// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-expect-error
global.grecaptchaDeferred = null;

it("renders without crashing", () => {
  const div = document.createElement("div");
  ReactDOM.render(
    <Providers>
      <App />
    </Providers>,
    div
  );
  ReactDOM.unmountComponentAtNode(div);
});
