// CAUTION: update `turbo.json`'s codegen task after editing this file

module.exports = {
  schema: './generated/schema.graphql',
  documents: ['test/**/*.ts'],
  extensions: {
    codegen: {
      generates: {
        './test/generated/gql/': {
          preset: 'client-preset',
          plugins: [
            {
              add: {
                content:
                  "import { JSONValue, JSONObject } from '../../../src/types/jsonTypes'",
              },
            },
          ],
        },
        './generated/schema.graphql': {
          plugins: ['schema-ast'],
        },
      },
      hooks: {
        afterOneFileWrite: ['prettier --write'],
      },
      config: {
        scalars: {
          DateTime: 'string',
          EmailAddress: 'string',
          JSON: 'JSONValue',
          JSONObject: 'JSONObject',
          JWT: 'string',
          UUID: 'string',
        },
      },
    },
  },
};
