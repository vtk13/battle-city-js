var Emitter = require('component-emitter');
var Collection = require('src/engine/store/collection.js');
var User = require('src/common/user.js');
var Premade = require('src/common/premade.js');
var serialization = require('src/battle-city/serialization.js');

function BcClient(socket)
{
    this.socket = socket;
    var self = this;

    this.users = new Collection().bindSource(socket, 'users');
    this.currentUser = new User(); // do not replace @todo allow replace
    this.users.bindSlave(this.currentUser);

    this.premades = new Collection().bindSource(socket, 'premades');
    this.currentPremade = new Premade(); // do not replace @todo allow replace
    this.currentPremade.on('gameover', function(winnerClanId) {
        self.socket.emit('gameover', this.id, winnerClanId);
    });
    this.premades.bindSlave(this.currentPremade);

    this.messages = new Collection().bindSource(socket, 'messages');
    this.premadeUsers = new Collection().bindSource(socket, 'premade.users');
    this.premadeMessages = new Collection().bindSource(socket, 'premade.messages');

    socket.on('logged', function(data) {
        self.currentUser.unserialize(data.user);
    });
    socket.on('unjoined', function() {
        // do not replace this.currentPremade
        self.currentPremade.unserialize([]);
    });
    socket.on('step', this.currentPremade.step.bind(this.currentPremade));

    socket.once('started', function(level) {
        self.currentPremade.startGame(level);
    });
}

Emitter(BcClient.prototype);

//===== actions ================================================================

BcClient.prototype.login = function(nick, done)
{
    this.socket.emit('login', {
        nick: nick
    });
    done && this.socket.once('logged', done);
};

BcClient.prototype.say = function(text)
{
    this.socket.emit('say', {
        text: text
    });
};

BcClient.prototype.join = function(name, gameType, done)
{
    this.socket.emit('join', {
        name: name,
        gameType: gameType
    });

    var self = this;
    this.socket.once('joined', function(data) {
        // do not replace this.currentPremade
        self.currentPremade.unserialize(data.premade);
        self.currentPremade.join(self.currentUser);
        done && done(data);
    });
};

BcClient.prototype.unjoin = function()
{
    this.socket.emit('unjoin');
};

// todo по идее этот метод можно перенести в некий ProxyPremade
BcClient.prototype.startGame = function(level)
{
    this.socket.emit('start', {
        level: level
    });
};

BcClient.prototype.control = function(commands)
{
    if (this.currentUser && this.currentUser.tank) {
        commands.id = this.currentUser.tank.id;
        this.socket.emit('control', commands);
    }
};

BcClient.prototype.turn = function(direction)
{
    this.control({
        turn: direction
    });
};

BcClient.prototype.startMove = function()
{
    this.control({
        startMove: 1
    });
};

BcClient.prototype.stopMove = function()
{
    this.control({
        stopMove: 1
    });
};

BcClient.prototype.fire = function()
{
    this.control({
        fire: 1
    });
};

//===== events =================================================================

BcClient.prototype.onConnect = function(handler)
{
    this.socket.on('connect', handler);
};

BcClient.prototype.onConnectFail = function(handler)
{
    this.socket.on('connect_failed', handler).on('error', handler);
};

module.exports = BcClient;
