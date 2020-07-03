import dotenv from "dotenv";
dotenv.config();

const ENVVARS = [
  "APOLLO_KEY",
  "JWT_PRIVATE_KEY",
  "JWT_PUBLIC_KEY",
  "DATABASE_URL",
  "REDIS_HOST",
  "REDIS_PORT",
  "GOOGLE_CLIENT_ID",
  "GOOGLE_CLIENT_SECRET",
  "FACEBOOK_APP_ID",
  "FACEBOOK_APP_SECRET",
  "RECAPTCHA_SECRET",
];

for (const varname of ENVVARS) {
  if (!process.env[varname]) {
    throw new Error(`configuration value ${varname} not found`);
  }
}

export default process.env;
