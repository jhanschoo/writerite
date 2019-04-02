/* eslint-disable no-unused-vars */
/* eslint-disable no-undef */
(() => {
  const createDeferred = () => {
    let res = null;
    const q = new Promise((resolve, reject) => {
      res = resolve;
    });
    return [q, res];
  };
  const [gp, gres] = createDeferred();
  const [fp, fres] = createDeferred();
  const [rp, rres] = createDeferred();
  window.gapiDeferred = gp
  window.FBDeferred = fp;
  window.grecaptchaDeferred = rp;
  // will be called by Google client vendor script due to passed callback
  // parameter
  window.gapiAsyncInit = () => {
    gapi.load('auth2', function () {
      gapi.auth2.init().then(() => gres(gapi));
    });
  }
  // will be called by ReCAPTCHA vendor script due to passed callback
  // parameter
  window.recaptchaAsyncInit = () => {
    rres(grecaptcha);
  }
  // will be called by Facebook vendor script
  window.fbAsyncInit = () => {
    const appId = document.querySelector("meta[name='fb-app_id']").getAttribute("content");
    FB.init({ appId, version: 'v3.2' });
    fres(FB);
  }
})();
window.dataLayer = window.dataLayer || [];
window.gtag = (...args) => { dataLayer.push(args); }
gtag('js', new Date());
gtag('config', 'UA-132209118-1');