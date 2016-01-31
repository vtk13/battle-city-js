var path = require('path');
var SplitByPathPlugin = require('webpack-split-by-path');

module.exports = {
    entry: {
        client: "src/client.js",
        test: "src/test.js"
    },
    output: {
        filename: "[name].js",
        chunkFilename: "[name].js"
    },
    module: {
        loaders: [
            {
                test: path.join(__dirname, 'src'),
                loader: 'babel', // 'babel-loader' is also a legal name to reference
                query: {
                    presets: ['react', 'es2015']
                }
            }
        ]
    },
    plugins: [
        new SplitByPathPlugin([
            {
                name: 'vendor',
                path: path.join(__dirname, 'node_modules')
            }
        ])
    ],
    resolve: {
        root: [
            __dirname
        ]
    }
};
