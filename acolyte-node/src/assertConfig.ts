import dotenv from 'dotenv';
dotenv.config();

const ENVVARS = [
  'GRAPHQL_HTTP',
];

ENVVARS.forEach((varname) => {
  if (!process.env[varname]) {
    throw new Error(`configuration value ${varname} not found`);
  }
});

export default process.env;
