isClient = function isClient()
{
    return false;
};

var http     = require("http"),
    url      = require("url"),
    path     = require("path"),
    fs       = require("fs");

registry = {};

require('./common/event');
require('./common/list');
require('./common/game');
require('./common/premade');
require('./server/premadelist');
require('./common/user');
require('./server/user');
require('./common/message');
require('./server/messagelist');
require('./common/func');
require('./common/map_tiled');
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
require('./battle-city/objects/checkpoint');
require('./battle-city/clan');

registry.users = new TList();
registry.premades = new TPremadeList();
registry.messages = new TMessageList();

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
    var user = null;
    socket.on('login', function(event){
        if (user == null && event.nick) {
            var nick = event.nick && event.nick.substr(0,20);
            var nickAllowed = true;
            registry.users.traversal(function(user){
                if (nick == user.nick) {
                    nickAllowed = false;
                }
            });
            if (nickAllowed) {
                user = new ServerUser();
                user.lastSync = 0;
                user.socket = socket;
                user.nick = nick;
                registry.users.add(user);
                user.updateIntervalId = setInterval(user.sendUpdatesToClient.bind(user), 50);
                socket.emit('logged', {
                    user: user.serialize()
                });
                user.watchCollection(registry.users, 'users');
                user.watchCollection(registry.premades, 'premades');
                user.watchCollection(registry.messages, 'messages');
                console.log(new Date().toLocaleTimeString() + ': user ' + nick + ' connected');
            } else {
                socket.emit('nickNotAllowed');
            }
        }
    });
    socket.on('join', function(event){
        try {
            registry.premades.join(event, user);
            socket.emit('joined', {
                // user not likely synced this premade yet
                premade: user.premade.serialize()
            });

            console.log(new Date().toLocaleTimeString() + ': user ' + user.nick
                    + ' join premade ' + user.premade.name + ' (' + event.gameType + ')');
        } catch (ex) {
            console.log(ex.message, ex.stack);
            socket.emit('user-message', {
                message: ex.message
            });
        }
    });
    socket.on('unjoin', function(){
        if (user.premade) {
            console.log(new Date().toLocaleTimeString() + ': user ' + user.nick + ' unjoin premade ' + user.premade.name);
            user.premade.unjoin(user);
            socket.emit('unjoined');
        }
    });
    socket.on('execute', function(event){
        var userFolder = path.join(process.cwd(), 'bots/'+user.id);
        try {
            fs.mkdirSync(userFolder, 0777);
        } catch (ex) {/*ignore EEXIST*/}
        var tries = fs.readdirSync(userFolder);
        var botSourceFile = path.join(userFolder, 'try' + tries.length + '.pas');
        fs.writeFileSync(botSourceFile, event.code);
        socket.emit('execute', {
            script: botSourceFile.substr(process.cwd().length)
        });
    });
    socket.on('start', function(event){
        if (user.premade && !user.premade.game) {
            if (event.level && user.premade.level != event.level) {
                user.premade.level = event.level;
                user.premade.emit('change');
            }
            user.premade.startGame();
            console.log(new Date().toLocaleTimeString() + ': user ' + user.nick + ' starts game ' + user.premade.name + ', level ' + user.premade.level);
        }
    });
    socket.on('stop-game', function(){
        if (user.premade) {
            user.premade.gameOver();
        }
    });
    socket.on('control', function(event) {
        if (user) {
            user.control(event);
        }
    });
    socket.on('say', function(event) {
        var message = event.text;
        if (typeof message == 'string') {
            message = message.substr(0, 200);
        }
        if (user.say(message)) {
            console.log(new Date().toLocaleTimeString() + ': user ' + user.nick + ' say ' + message);
        } else {
            user.clientMessage('doNotFlood');
        }
    });
    socket.on('disconnect', function(event) {
        try {
            var connections = -1;
            for (var i in socket.manager.connected) {
                connections++;
            }
        } catch(e) {}
        if (user) {
            console.log(new Date().toLocaleTimeString() + ': user ' + user.nick + ' disconnected (' + connections , ' total)');
            clearInterval(user.updateIntervalId);
            user.unwatchAll();
            user.socket = null;
            if (user.premade) {
                user.premade.unjoin(user);
            }
            registry.users.remove(user);
        } else {
            console.log(new Date().toLocaleTimeString() + ': anonymous disconnected (' + connections , ' total)');
        }
    });
    try {
        var connections = 0;
        for (var i in socket.manager.connected) {
            connections++;
        }
    } catch(e) {}
    console.log(new Date().toLocaleTimeString() + ': Connection accepted (' + connections , ' total)');
});
