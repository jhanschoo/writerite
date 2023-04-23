const projects = {};

["packages/yoga-app/", "packages/yoga-app-e2e/", "apps/frontend-next/"].forEach((path) => {
  const subConfig = require("./" + path + "graphql.config");
  projects[path] = {
    schema: path + subConfig.schema,
    documents: subConfig.documents.map((documentPath) => path + documentPath),
  };
});

module.exports = {
  projects
}