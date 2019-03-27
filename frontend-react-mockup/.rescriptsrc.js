const { getPaths, edit } = require('@rescripts/utilities')

const isBabelLoader = (o) => {
  if (o && o.loader && o.loader.includes('babel-loader') && o.include && o.include.endsWith("/src")) {
    return true;
  }
  return false;
}

module.exports = [{
  webpack: (config) => {
    //console.log(config.module.rules[2].oneOf[1].options.plugins);
    const babelLoaderPaths = getPaths(isBabelLoader, config)
    return edit((babelLoader) => {
      const plugins = babelLoader.options.plugins;
      plugins.push("babel-plugin-styled-components")
      return babelLoader
    }, babelLoaderPaths, config);
  }
}];
