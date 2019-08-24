import dotenv from 'dotenv';
dotenv.config();

const ENVVARS = [
  'ENGINE_API_KEY',
  'GOOGLE_CLIENT_ID',
  'GOOGLE_CLIENT_SECRET',
  'FACEBOOK_APP_ID',
  'FACEBOOK_APP_SECRET',
  'PRISMA_ENDPOINT',
  'RECAPTCHA_SECRET',
  'REDIS_HOST',
  'REDIS_PORT',
];

ENVVARS.forEach((varname) => {
  if (!process.env[varname]) {
    throw new Error(`configuration value ${varname} not found`);
  }
});

export default process.env;
