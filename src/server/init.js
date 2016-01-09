var http = require('http');
var url = require('url');
var path = require('path');
var fs = require('fs');
var io = require('socket.io');
var Collection = require('src/engine/store/collection.js');
var PremadeList = require('src/server/premadelist.js');
var MessageList = require('src/server/messagelist.js');
var BcServerInterface = require('src/common/server.js');
var serialization = require('src/battle-city/serialization.js');
var odb = require('src/engine/store/odb.js');
var registry = require('src/common/registry.js');

registry.odb = odb;
// todo globals
oldGlobalRegistry = {};

oldGlobalRegistry.users = new Collection();
oldGlobalRegistry.premades = new PremadeList();
oldGlobalRegistry.messages = new MessageList();

process.on('uncaughtException', function(ex) {
    if (ex.stack) {
        console.log(ex.stack);
    } else {
        console.log(ex);
        console.trace();
    }
});

/**
 * Server is responsible for accepting user connections.
 */
var server = require('http').createServer(function(request, response) {
    if (process.argv.indexOf('serve-static') == -1) {
        console.warn('Http request, but serving static files is disabled');
        // static served with haproxy + nginx
        response.writeHead(301, {'Location':'http://'+request.headers.host.replace(/:\d+$/, '')});
        response.end();
    } else {
        var uri = url.parse(request.url).pathname;
        if (uri == '/') {
            uri = '/index.html';
        }
        var filename = path.join(process.cwd(), uri);

        fs.readFile(filename, "binary", function(err, file) {
            if(err) {
                response.writeHead(500, {"Content-Type": "text/plain"});
                response.write(err + "\n");
                response.end();
                return;
            }

            var exts = {
                    '.html': 'text/html',
                    '.js': 'application/x-javascript',
                    '.png': 'image/png',
                    '.css': 'text/css'
            };
            response.writeHead(200, {
                'Content-Type': exts[path.extname(filename)]
            });
            response.write(file, "binary");
            response.end();
        });
    }
});
server.listen(8124);

var config = {
    'browser client minification': true,
    'browser client etag': true,
    'browser client gzip': true,
    'transports': ['websocket'],
    'log level': 1
};

io.listen(server, config).sockets.on('connection', function(socket) {
    new BcServerInterface(socket);
});
