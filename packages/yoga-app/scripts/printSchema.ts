import { writeFileSync } from 'fs';
import { printSchema } from 'graphql';

import { schema } from '../src/schema';

const schemaString = printSchema(schema);
writeFileSync('./generated/schema.graphql', schemaString, {});
