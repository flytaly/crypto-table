// https://ant.design/docs/react/use-with-create-react-app#Customize-Theme

/* eslint-disable no-param-reassign,import/no-extraneous-dependencies */
const { injectBabelPlugin } = require('react-app-rewired');
const rewireLess = require('react-app-rewire-less');
const modifyVars = require('./antd-less-vars');

module.exports = function override(config, env) {
    config = injectBabelPlugin(['import', { libraryName: 'antd', style: true }], config);
    config = rewireLess.withLoaderOptions({
        javascriptEnabled: true,
        modifyVars,
    })(config, env);
    return config;
};
