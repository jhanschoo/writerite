const fs = require('fs');

const frontend = (process.env.NODE_ENV === 'production')
  ? '//writerite.site'
  : '//localhost:3000';
const backend = (process.env.NODE_ENV === 'production')
? '//ritewrite.site'
: '//localhost:4000';

module.exports = [{
  devServer: (config) => {
    // Note: these headers apply only in development
    //   to have these headers in production, confirm that they
    //   work wrt inline and eval for the production version
    //   and set on the production server
    // *.facebook.com is a hack since FB is bad with CSP.
    // config.headers = Object.assign({}, config.headers, {
    //   "Content-Security-Policy": `default-src *.facebook.com; connect-src https:${frontend} https:${backend} wss:${frontend} wss:${backend} https://graph.facebook.com; font-src data: https:${frontend} https://fonts.gstatic.com; frame-src https://staticxx.facebook.com https://accounts.google.com https://www.google.com; img-src data: https:${frontend} https://www.facebook.com https://www.gravatar.com; script-src https:${frontend} https://apis.google.com https://www.google.com https://connect.facebook.net https://ssl.gstatic.com https://www.gstatic.com; manifest-src https:${frontend}; style-src 'unsafe-inline' https:${frontend} https://fonts.googleapis.com`
    // });
    if (process.env.HTTPS_CERT_FILE && process.env.HTTPS_KEY_FILE) {
      config.https = {
        cert: fs.readFileSync(process.env.HTTPS_CERT_FILE),
        key: fs.readFileSync(process.env.HTTPS_KEY_FILE),
      };
    }
    return config;
  }
}];
