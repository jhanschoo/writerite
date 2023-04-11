import { printSchema } from "graphql";
import { schema } from "../src/schema";
import { writeFileSync } from "fs";

const schemaString = printSchema(schema);
writeFileSync("./generated/schema.graphql", schemaString, {});
