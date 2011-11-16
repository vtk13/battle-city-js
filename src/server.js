callback = function(method, context)
{
    return function() {
        method.apply(context, arguments);
    };
};

isClient = function isClient()
{
    return false;
};

var sys      = require("sys"),
    http     = require("http"),
    url      = require("url"),
    path     = require("path"),
    fs       = require("fs");

registry = {};

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
require('./utils/func');
require('./utils/map_tiled'); // require('./utils/map_arrayed');
require('./battle-city/field');
require('./battle-city/bot-emitter');
require('./battle-city/keyboard');
require('./battle-city/objects/abstract');
require('./battle-city/objects/animation');
require('./battle-city/objects/bullet');
require('./battle-city/objects/tank');
require('./battle-city/objects/tankbot');
require('./battle-city/objects/wall');
require('./battle-city/objects/delimiter');
require('./battle-city/objects/base');
require('./battle-city/objects/bonus');
require('./battle-city/objects/trees');
require('./battle-city/objects/water');
require('./battle-city/objects/ice');
require('./battle-city/clan');

registry.users = new TList();
registry.premades = new TPremadeList();
registry.messages = new TMessageList();

setInterval(function(){
    var timestamp = Date.now() - 1 /* minutes */ * 60 * 1000;
    registry.users.clearRemoved(timestamp);
    registry.premades.clearRemoved(timestamp);
    registry.messages.clearRemoved(timestamp);
}, 1 /* minutes */ * 60 * 1000);

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
io.listen(server, {'log level': 1}).sockets.on('connection', function(socket) {
    var user = null;
    socket.on('message', function(event) {
        switch (event.type) {
            case 'connect':
                if (user == null && event.nick) {
                    user = new User();
                    user.lastSync = 0;
                    user.socket = socket;
                    user.nick = event.nick;
                    registry.users.add(user);
                    user.updateIntervalId = setInterval(callback(user.sendUpdatesToClient, user), 50);
                    user.sendToClient({
                        type: 'connected',
                        userId: user.id
                    });
                    console.log(new Date().toLocaleTimeString() + ': User ' + event.nick + ' connected');
                }
                break;
            case 'join':
                try {
                    registry.premades.join(event, user);
                    user.sendToClient({
                        type: 'joined',
                        premade: user.premade.serialize()
                    });
                    console.log(new Date().toLocaleTimeString() + ': User ' + user.nick + ' join premade ' + user.premade.name);
                } catch (ex) {
                    user.sendToClient({
                        type: 'user-message',
                        message: ex.message
                    });
                }
                break;
            case 'unjoin':
                if (user.premade) {
                    console.log(new Date().toLocaleTimeString() + ': User ' + user.nick + ' unjoin premade ' + user.premade.name);
                    user.premade.unjoin(user);
                    user.sendToClient({
                        type: 'unjoined'
                    });
                }
                break;
            case 'start':
                if (user.premade) {
                    user.premade.startGame();
                    console.log(new Date().toLocaleTimeString() + ': User ' + user.nick + ' starts game ' + user.premade.name + ', level ' + user.premade.level);
                }
                break;
            case 'control':
                user.control(event);
                break;
            case 'say':
                user.say(event.text);
                console.log(new Date().toLocaleTimeString() + ': User ' + user.nick + ' say ' + event.text);
                break;
        }
    });
    socket.on('disconnect', function(event) {
        if (user) {
            console.log(new Date().toLocaleTimeString() + ': User ' + user.nick + ' disconnected');
            clearInterval(user.updateIntervalId);
            user.socket = null; // to be on the safe side
            if (user.premade) {
                user.premade.unjoin(user);
            }
            registry.users.remove(user);
        }
    });
    console.log(new Date().toLocaleTimeString() + ': Connection accepted');
    socket.json.send({
        'type': 'init'
    });
});
