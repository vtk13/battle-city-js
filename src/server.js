callback = function(method, context)
{
    return function() {
        method.apply(context, arguments);
    };
};

//todo ??
Image = function() {};

var sys     = require("sys"),
    http    = require("http"),
    url     = require("url"),
    path    = require("path"),
    fs      = require("fs");

require('./core/event');
require('./server/loggable');
require('./core/list');
require('./core/game');
require('./core/premade');
require('./server/premadelist');
require('./core/user');
require('./server/user');
require('./core/message');
require('./server/messagelist');
require('./battle-city/field');
require('./battle-city/bot-emitter');
require('./battle-city/keyboard');
require('./battle-city/objects/bullet');
require('./battle-city/objects/tank');
require('./battle-city/objects/tankbot');
require('./battle-city/objects/wall');
require('./battle-city/objects/delimiter');
require('./battle-city/objects/base');
require('./battle-city/objects/bonus');
require('./battle-city/objects/trees');

registry = {
    users: new TList(),
    premades: new TPremadeList(),
    messages: new TMessageList()
};

process.on('uncaughtException', function(ex) {
    console.log(ex.stack);
});

/**
 * Server is responsible for accepting user connections.
 */
var server = require('http').createServer(function(request, response) {
    // serve static files
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
});
server.listen(8124);

var io = require('socket.io');
io.listen(server).sockets.on('connection', function(socket) {
    var user = null;
    socket.on('message', function(event) {
        switch (event.type) {
            case 'connect':
                if (user == null) {
                    user = new User();
                    user.lastSync = 0;
                    user.socket = socket;
                    user.nick = event.nick;
                    registry.users.add(user);
                    setInterval(callback(user.sendUpdatesToClient, user), 50);
                    socket.json.send({
                        type: 'connected',
                        userId: user.id
                    });
                }
                break;
            case 'join':
                registry.premades.join(event, user);
                socket.json.send({
                    type: 'joined',
                    premade: user.premade.serialize()
                });
                break;
            case 'unjoin':
                if (user.premade) {
                    user.premade.unjoin(user);
                    socket.json.send({
                        type: 'unjoined'
                    });
                }
            case 'start':
                if (user.premade) {
                    user.premade.startGame();
                }
            case 'control':
                user.control(event);
                break;
            case 'say':
                user.say(event.text);
                break;
        }
    });
    socket.on('disconnect', function(event) {
        if (user) {
            if (user.premade) {
                user.premade.unjoin(user);
            }
            registry.users.remove(user);
        }
    });
});
