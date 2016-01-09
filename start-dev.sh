#!/bin/sh
echo Build
NODE_PATH=.:node_modules node_modules/webpack/bin/webpack.js src/client/init.js bundle.js
echo Start
NODE_PATH=.:node_modules node src/server/init serve-static
