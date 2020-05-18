import dotenv from "dotenv";
dotenv.config();

const ENVVARS = [
  "APOLLO_KEY",
  "DATABASE_URL",
  "GOOGLE_CLIENT_ID",
  "GOOGLE_CLIENT_SECRET",
  "FACEBOOK_APP_ID",
  "FACEBOOK_APP_SECRET",
  "RECAPTCHA_SECRET",
  "REDIS_HOST",
  "REDIS_PORT",
];

for (const varname of ENVVARS) {
  if (!process.env[varname]) {
    throw new Error(`configuration value ${varname} not found`);
  }
}

export default process.env;
