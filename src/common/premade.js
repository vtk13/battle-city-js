var Emitter = require('component-emitter');
var func = require('src/common/func.js');
var Collection = require('src/engine/store/collection.js');
var Clan = require('src/battle-city/clan.js');
var BotsClan = require('src/battle-city/bots-clan.js');
var Field = require('src/battle-city/field.js');

function Premade(name, type)
{
    this.name = name;
    this.level = 1;
    this.userCount = 0;
    this.locked = false; // lock for new users

    this.users = new Collection();
    this.messages = new Collection();
    this.setType(type || 'classic');
    this.stepIntervalId = null;
}

Emitter(Premade.prototype);

Premade.types = {
    'classic': {
        'levels': 35
    },
    'teamvsteam': {
        'levels': 1
    }
};

Premade.prototype.setType = function(type)
{
    if (type != this.type) {
        this.type = type;
        switch (this.type) {
            case 'classic':
                this.clans = [new Clan(1, 10*30/*~30step per seconds*/), new BotsClan(2, 10*30/*~30step per seconds*/)];
                break;
            case 'teamvsteam':
                this.clans = [new Clan(1, 2*30/*~30step per seconds*/), new Clan(2, 2*30/*~30step per seconds*/)];
                break;
        }
        this.clans[0].premade = this.clans[1].premade = this;
        this.clans[0].enemiesClan = this.clans[1];
        this.clans[1].enemiesClan = this.clans[0];
    }
};

Premade.prototype.say = function(message)
{
    this.messages.add(message);
    for (var i in this.messages.items) {
        if (this.messages.items[i].time + 5 * 60 * 1000 < Date.now()) {
            this.messages.remove(this.messages.items[i]);
        }
    }
};

Premade.prototype.setClan = function(user, clanId)
{
    this.clans[clanId].attachUser(user);
};

Premade.prototype.join = function(user, clanId)
{
    clanId = clanId || 0;
    if (this.type == 'teamvsteam' && this.clans[clanId].isFull()) {
        clanId = 1;
    }
    if (!this.locked && !this.clans[clanId].isFull()) {
        // todo extract to user method setPremade()
        if (user.premade) {
            user.premade.unjoin();
        }
        user.premade = this;
        this.clans[clanId].attachUser(user);
        this.users.add(user);
        this.userCount++;
        this.emit('change');
        // todo extract to user methods setLives(), setPoints() ?
        user.lives = 4;
        user.points = 0;
        user.emit('change');
        user.watchCollection(this.users, 'premade.users');
        user.watchCollection(this.messages, 'premade.messages');
    } else {
        throw {message: 'К этой игре уже нельзя присоединиться.'};
    }
};

Premade.prototype.unjoin = function(user)
{
    user.unwatchCollection('premade.users');
    user.unwatchCollection('premade.messages');
    user.unwatchCollection('f');
    user.unwatchCollection('game.botStack');
    user.clan.detachUser(user);
    this.users.remove(user);
    this.userCount--;
    user.premade = null;
    this.emit('change');
    if (this.userCount == 0) {
        oldGlobalRegistry.premades.remove(this);
        this.removed = true; // dirty hack
    }
};

Premade.prototype.startGame = function()
{
    if (this.running) {
        return false;
    }

    this.locked = true;
    var self = this;
    var level = require('src/battle-city/maps/' + this.type + '/level' + this.level + '.js');

    self.running = true;
    self.field = func.isClient() ? window.bcClient.field : new Field(13*32, 13*32);
    self.field.terrain(level.getMap());

    self.clans[0].startGame(self.field, level);
    self.clans[1].startGame(self.field, level);
    self.users.traversal(function(user) {
        user.watchCollection(this.field, 'f');
        if (user.clan.enemiesClan.botStack) {
            user.watchCollection(user.clan.enemiesClan.botStack, 'game.botStack');
        }
        if (user.premade.type == 'teamvsteam') {
            user.lives = 4;
            user.emit('change');
        }
        user.clientMessage('started');
    }, self);
    self.stepIntervalId = setInterval(self.step.bind(self), 30);
    self.emit('change');
};

Premade.prototype.step = function()
{
    this.field.step();
    this.clans[0].step();
    this.clans[1].step();
};

Premade.prototype.lock = function()
{
    this.locked = true;
    this.emit('change');
};

Premade.prototype.gameOver = function(winnerClan, timeout)
{
    if (this.running) {
        this.running = false;
        if (timeout) {
            setTimeout(this._gameOver.bind(this, winnerClan), timeout);
        } else {
            this._gameOver(winnerClan);
        }
    }
};

Premade.prototype._gameOver = function(winnerClan)
{
    if (this.stepIntervalId) {
        clearInterval(this.stepIntervalId);
        this.stepIntervalId = null;
        this.field.removeAllListeners();
        if (this.type == 'teamvsteam') {
            this.locked = false;
        }
        if (this.type == 'classic' && this.clans[0] == winnerClan) {
            this.level++;
            if (this.level > Premade.types[this.type].levels) {
                this.level = 1;
            }
        }
        if (this.removed === undefined) { // todo dirty hack
            this.emit('change');
        }
        this.users.traversal(function(user) {
            user.unwatchCollection('f');
            user.unwatchCollection('game.botStack');
            user.clientMessage('gameover', {
                winnerClan: winnerClan ? winnerClan.n : 0
            });
            console.log(new Date().toLocaleTimeString() + ': user ' + user.nick +
                    ' has left game ' + user.premade.name);
        }, this);
    }
};

module.exports = Premade;
