// CAUTION: update `turbo.json`'s codegen task after editing this file

module.exports = {
  schema: 'node_modules/yoga-app/generated/schema.graphql',
  documents: ['{pages,src}/**/*.{ts,tsx}'],
  extensions: {
    codegen: {
      generates: {
        './generated/gql/': {
          preset: 'client-preset',
          plugins: [
            {
              add: {
                content:
                  "import { JSONValue, JSONObject } from '../../src/utils/jsonTypes'",
              },
            },
          ],
        },
        './generated/schema.graphql.json': {
          plugins: ['introspection'],
          config: { minify: true },
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
