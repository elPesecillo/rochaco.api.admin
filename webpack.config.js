const path = require('path');
const SERVER_DIR = path.resolve(__dirname, '');
const BUILD_DIR = path.resolve(__dirname, 'build');
const webpackNodeExternals = require('webpack-node-externals');

const config = {
    mode: 'development',
    target: 'node',
    entry: SERVER_DIR + '/src/server.js',

    output: {
        path: BUILD_DIR,
        filename: 'app.server.js'
    },
    devtool: 'source-map',
    module: {
        rules: [{
            test: /\.js?$/,
            options: {
                "plugins": ["transform-class-properties"]
            },
            loader: 'babel-loader',
            exclude: /node_modules/
        }
        ]
    },
    externals: [webpackNodeExternals()]
};

//module.exports = merge(baseConfig, config);
module.exports = config;