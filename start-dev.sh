#!/bin/sh
echo Build
node_modules/webpack/bin/webpack.js src/client/init.js bundle.js
echo Start
node src/server/init serve-static
