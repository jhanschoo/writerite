module.exports = {
  schema: 'node_modules/yoga-app/generated/schema.graphql',
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
                  "import { JSONValue, JSONObject } from '../../helpers/types/jsonTypes'",
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
