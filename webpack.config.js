module.exports = {
    entry: {
        client: "src/client/init.js",
        test: "src/test.js"
    },
    output: {
        filename: "[name].js"
    },
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
