
var http     = require("http"),
    url      = require("url"),
    path     = require("path"),
    fs       = require("fs");

// todo globals
registry = {};

require('../common/event');
require('../common/list');
require('../common/game');
require('../common/premade');
require('../server/premadelist');
require('../common/user');
require('../server/user');
require('../common/message');
require('../server/messagelist');
require('../common/func');
require('../common/map_tiled');
require('../battle-city/field');
require('../battle-city/bot-emitter');
require('../battle-city/objects/abstract');
require('../battle-city/objects/animation');
require('../battle-city/objects/bullet');
require('../battle-city/objects/tank');
require('../battle-city/objects/tankbot');
require('../battle-city/objects/wall');
require('../battle-city/objects/delimiter');
require('../battle-city/objects/base');
require('../battle-city/objects/bonus');
require('../battle-city/objects/trees');
require('../battle-city/objects/water');
require('../battle-city/objects/ice');
require('../battle-city/objects/checkpoint');
require('../battle-city/goals');
require('../battle-city/clan');
require('../edu/course');
require('../edu/courselist');
require('../edu/exercise');
require('../edu/exerciselist');
require('../common/server');

registry.users = new TList();
registry.premades = new TPremadeList();
registry.messages = new TMessageList();
registry.courses = new CoursesList();

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
        // static served with haproxy + nginx
        response.writeHead(301, {'Location':'http://'+request.headers.host.replace(/:\d+$/, '')});
        response.end();
    } else {
        var uri = url.parse(request.url).pathname;
        if (uri == '/') {
            uri = '/index.html';
        }
        var filename = path.join(process.cwd(), uri);
        path.exists(filename, function(exists) {
            if(!exists) {
                response.writeHead(404, {"Content-Type": "text/plain"});
                response.write("404 Not Found\n");
                response.end();
                return;
            }

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
        });
    }

});
server.listen(8124);

var io = require('socket.io');
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
