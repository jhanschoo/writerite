import dotenv from 'dotenv';
dotenv.config();

const ENVVARS = [
  'GOOGLE_CLIENT_ID',
  'GOOGLE_CLIENT_SECRET',
  'FACEBOOK_APP_ID',
  'FACEBOOK_APP_SECRET',
  'RECAPTCHA_SECRET',
  // 'CERT_FILE',
  // 'KEY_FILE',
  // 'REDIS_HOST',
  // 'REDIS_PORT',
];

ENVVARS.forEach((varname) => {
  if (!process.env[varname]) {
    throw new Error(`configuration value ${varname} not found`);
  }
});

export default process.env;
