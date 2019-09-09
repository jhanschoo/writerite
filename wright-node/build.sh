cp -R ../client-models src/
apollo client:codegen -t "$NODE_ENV" --useReadOnlyTypes --globalTypesFile=src/gqlGlobalTypes.ts --target=typescript gqlTypes
tsc
