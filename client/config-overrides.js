// https://ant.design/docs/react/use-with-create-react-app#Customize-Theme
const { override, fixBabelImports, addLessLoader } = require('customize-cra');
const modifyVars = require('./antd-less-vars');


module.exports = override(
    fixBabelImports('import', {
        libraryName: 'antd',
        libraryDirectory: 'es',
        style: true,
    }),
    addLessLoader({
        javascriptEnabled: true,
        modifyVars,
    }),
);
