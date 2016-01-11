var path = require('path');
var SplitByPathPlugin = require('webpack-split-by-path');

module.exports = {
    entry: {
        client: "src/client/init.js",
        test: "src/test.js"
    },
    output: {
        filename: "[name].js",
        chunkFilename: "[name].js"
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
    },
    node: {
        fs: 'empty',
        tls: 'empty'
    }
};
