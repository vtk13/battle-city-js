var path = require('path');
var fs = require('fs');

// http://jlongster.com/Backend-Apps-with-Webpack--Part-I#Getting-Started
var nodeModules = {};
fs.readdirSync('node_modules')
    .filter(function(x) {
        return ['.bin'].indexOf(x) === -1;
    })
    .forEach(function(mod) {
        nodeModules[mod] = 'commonjs ' + mod;
    });

module.exports = {
    target: 'node',
    entry: 'src/server.js',
    output: {
        filename: "server.js"
    },
    module: {
        loaders: [
            {
                test: /\.jsx?$/,
                exclude: /(node_modules|bower_components)/,
                loader: 'babel', // 'babel-loader' is also a legal name to reference
                query: {
                    presets: ['react', 'es2015']
                }
            }
        ]
    },
    externals: nodeModules,
    resolve: {
        root: [
            __dirname
        ]
    }
};
