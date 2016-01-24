#!/bin/sh
NODE_PATH=.:node_modules node_modules/webpack/bin/webpack.js
echo Start
NODE_PATH=.:node_modules node src/server serve-static
