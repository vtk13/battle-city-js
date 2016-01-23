var path = require('path');
var fs = require('fs');
var User = require('src/common/user.js');
var Odb = require('src/engine/store/odb.js');

var Collection = require('src/engine/store/collection.js');
var PremadeList = require('src/engine/store/premade-list.js');
var MessageList = require('src/engine/store/message-list.js');

module.exports = BcServerInterface;
module.exports.updateInterval = 50;

function BcServerInterface(socket, users, premades, messages)
{
    this.user = null;
    this.socket = socket;
    this.users = users || new Collection(); // handy for tests
    this.premades = premades || new PremadeList(); // handy for tests
    this.messages = messages || new MessageList(this.users); // handy for tests

    socket.on('login',      this.onLogin.bind(this));
    socket.on('join',       this.onJoin.bind(this));
    socket.on('unjoin',     this.onUnjoin.bind(this));
    socket.on('start',      this.onStart.bind(this));
    socket.on('control',    this.onControl.bind(this));
    socket.on('say',        this.onSay.bind(this));
    socket.on('disconnect', this.onDisconnect.bind(this));
    socket.on('gameover',   this.onGameOver.bind(this));
}

BcServerInterface.prototype.onLogin = function(event)
{
    if (this.user == null && event.nick) {
        var nick = event.nick && event.nick.substr(0,20);
        var nickAllowed = true;
        this.users.traversal(function(user){
            if (nick == user.nick) {
                nickAllowed = false;
            }
        });
        if (nickAllowed) {
            this.user = Odb.instance().create(User);
            this.user.lastSync = 0;
            this.user.socket = this.socket;
            this.user.nick = nick;
            this.users.add(this.user);
            this.user.updateIntervalId = setInterval(
                this.user.sendUpdatesToClient.bind(this.user),
                module.exports.updateInterval
            );
            this.socket.emit('logged', {
                user: this.user.serialize()
            });
            this.user.watchCollection(this.users, 'users');
            this.user.watchCollection(this.premades, 'premades');
            this.user.watchCollection(this.messages, 'messages');
        } else {
            this.socket.emit('nickNotAllowed');
        }
    }
};

BcServerInterface.prototype.onJoin = function(event)
{
    try {
        this.premades.join(event, this.user);
        this.socket.emit('joined', {
            // this premade has not probably synced yet
            premade: this.user.premade.serialize()
        });
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
        this.user.premade.unjoin(this.user);
        this.socket.emit('unjoined');
    }
};

BcServerInterface.prototype.onStart = function(event)
{
    // todo to premade?
    if (this.user.premade && !this.user.premade.running) {
        this.user.premade.startGame(event.level);
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
    if (!this.user.say(message)) {
        this.user.clientMessage('doNotFlood');
    }
};

BcServerInterface.prototype.onDisconnect = function(event)
{
    if (this.user) {
        clearInterval(this.user.updateIntervalId);
        this.user.unwatchAll();
        this.user.socket = null;
        if (this.user.premade) {
            this.user.premade.unjoin(this.user);
        }
        this.users.remove(this.user);
    }
};

BcServerInterface.prototype.onGameOver = function(premadeId, winnerClanId)
{
    var premade = this.premades.get(premadeId);
    if (premade) {
        premade.gameOver(winnerClanId);
    }
};
