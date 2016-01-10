#!/bin/sh
echo Build Test
NODE_PATH=.:node_modules node_modules/webpack/bin/webpack.js src/test.js test.js
echo Build Source
NODE_PATH=.:node_modules node_modules/webpack/bin/webpack.js src/client/init.js bundle.js
echo Start
NODE_PATH=.:node_modules node src/server/init serve-static
