import dotenv from 'dotenv';
dotenv.config();

const ENVVARS = [
  'GRAPHQL_HTTP',
  'REDIS_HOST',
  'REDIS_PORT',
];

ENVVARS.forEach((varname) => {
  if (!process.env[varname]) {
    throw new Error(`configuration value ${varname} not found`);
  }
});

export default process.env;
