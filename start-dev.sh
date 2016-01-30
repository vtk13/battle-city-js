#!/bin/sh
rm -f client.js server.js test.js vendor.js
node_modules/webpack/bin/webpack.js --config webpack-client-config.js
node_modules/webpack/bin/webpack.js --config webpack-server-config.js
echo Start
node server.js serve-static
