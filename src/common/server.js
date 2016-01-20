var path = require('path');
var fs = require('fs');
var User = require('src/common/user.js');
var registry = require('src/common/registry.js');

module.exports = BcServerInterface;

/**
 * This object is an interface for "server-side" variables. All access to them
 * should be done here.
 *
 * @param socket EventEmitter
 */
function BcServerInterface(socket)
{
    this.user = null;
    this.socket = socket;
    socket.on('login',      this.onLogin.bind(this));
    socket.on('join',       this.onJoin.bind(this));
    socket.on('unjoin',     this.onUnjoin.bind(this));
    socket.on('start',      this.onStart.bind(this));
    socket.on('control',    this.onControl.bind(this));
    socket.on('say',        this.onSay.bind(this));
    socket.on('disconnect', this.onDisconnect.bind(this));
    socket.on('gameover',   this.onGameOver.bind(this));

    try {
        var connections = 0;
        for (var i in socket.manager.connected) {
            connections++;
        }
    } catch(e) {}
    console.log(new Date().toLocaleTimeString() + ': Connection accepted (' + connections , ' total)');
}

BcServerInterface.prototype.onLogin = function(event)
{
    if (this.user == null && event.nick) {
        var nick = event.nick && event.nick.substr(0,20);
        var nickAllowed = true;
        oldGlobalRegistry.users.traversal(function(user){
            if (nick == user.nick) {
                nickAllowed = false;
            }
        });
        if (nickAllowed) {
            this.user = registry.odb.create(User);
            this.user.lastSync = 0;
            this.user.socket = this.socket;
            this.user.nick = nick;
            oldGlobalRegistry.users.add(this.user);
            this.user.updateIntervalId = setInterval(this.user.sendUpdatesToClient.bind(this.user), 50);
            this.socket.emit('logged', {
                user: this.user.serialize()
            });
            this.user.watchCollection(oldGlobalRegistry.users, 'users');
            this.user.watchCollection(oldGlobalRegistry.premades, 'premades');
            this.user.watchCollection(oldGlobalRegistry.messages, 'messages');
            console.log(new Date().toLocaleTimeString() + ': user ' + nick + ' connected');
        } else {
            this.socket.emit('nickNotAllowed');
        }
    }
};

BcServerInterface.prototype.onJoin = function(event)
{
    try {
        oldGlobalRegistry.premades.join(event, this.user);
        this.socket.emit('joined', {
            // this premade has not probably synced yet
            premade: this.user.premade.serialize()
        });

        console.log(new Date().toLocaleTimeString() + ': user ' + this.user.nick
                + ' join premade ' + this.user.premade.name + ' (' + event.gameType + ')');
    } catch (ex) {
        this.socket.emit('user-message', {
            message: ex.message
        });
        throw ex;
    }
};

BcServerInterface.prototype.onUnjoin = function()
{
    if (this.user.premade) {
        console.log(new Date().toLocaleTimeString() + ': user ' + this.user.nick
                + ' unjoin premade ' + this.user.premade.name);
        this.user.premade.unjoin(this.user);
        this.socket.emit('unjoined');
    }
};

BcServerInterface.prototype.onStart = function(event)
{
    // todo to premade?
    if (this.user.premade && !this.user.premade.running) {
        this.user.premade.startGame(event.level);
        console.log(new Date().toLocaleTimeString() + ': user ' + this.user.nick
                + ' starts game ' + this.user.premade.name + ', level ' + this.user.premade.level);
    }
};

BcServerInterface.prototype.onControl = function(event)
{
    this.user && this.user.premade && this.user.premade.control(this.user, event);
};

BcServerInterface.prototype.onSay = function(event)
{
    var message = event.text;
    if (typeof message == 'string') {
        message = message.substr(0, 200);
    }
    if (this.user.say(message)) {
        console.log(new Date().toLocaleTimeString() + ': user ' + this.user.nick + ' say ' + message);
    } else {
        this.user.clientMessage('doNotFlood');
    }
};

BcServerInterface.prototype.onDisconnect = function(event)
{
    try {
        var connections = -1;
        for (var i in this.socket.manager.connected) {
            connections++;
        }
    } catch(e) {}
    if (this.user) {
        console.log(new Date().toLocaleTimeString() + ': user ' + this.user.nick
                + ' disconnected (' + connections , ' total)');
        clearInterval(this.user.updateIntervalId);
        this.user.unwatchAll();
        this.user.socket = null;
        if (this.user.premade) {
            this.user.premade.unjoin(this.user);
        }
        oldGlobalRegistry.users.remove(this.user);
    } else {
        console.log(new Date().toLocaleTimeString() + ': anonymous disconnected ('
                + connections , ' total)');
    }
};

BcServerInterface.prototype.onGameOver = function(premadeId, winnerClanId)
{
    var premade = oldGlobalRegistry.premades.get(premadeId);
    if (premade) {
        premade.gameOver(winnerClanId);
    }
};
