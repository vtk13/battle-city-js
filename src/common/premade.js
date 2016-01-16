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

    this.stepActions = [];
    this.stepIntervalId = null;

    this.field = new Field(13*32, 13*32);
}

Emitter(Premade.prototype);

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

    this.running = true;
    this.field.terrain(level.getMap());
    this.field.add(this.clans[0]);
    this.field.add(this.clans[1]);

    this.clans[0].startGame(level);
    this.clans[1].startGame(level);

    this.users.map(function(user) {
        user.watchCollection(self.field, 'f');
        if (user.clan.enemiesClan.botStack) {
            user.watchCollection(user.clan.enemiesClan.botStack, 'game.botStack');
        }
        if (user.premade.type == 'teamvsteam') {
            user.lives = 4;
            user.emit('change');
        }
        user.clientMessage('started');
    });

    this.stepActions = [];
    this.stepIntervalId = setInterval(this.step.bind(this), 30);
    this.emit('change');
};

Premade.prototype.control = function(user, event)
{
    if (user.tank) {
        var id = user.tank.id;

        if (event.turn) {
            this.stepActions.push([id, 'turn', [event.turn]]);
        }
        if (event.startMove) {
            this.stepActions.push([id, 'startMove', []]);
        }
        if (event.stopMove) {
            this.stepActions.push([id, 'stopMove', []]);
        }
        if (event.fire) {
            this.stepActions.push([id, 'fire', []]);
        }
    }
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

function ServerPremade()
{
    Premade.apply(this, arguments);
}

ServerPremade.prototype = Object.create(Premade.prototype);
ServerPremade.prototype.constructor = ServerPremade;

function ClientPremade()
{
    Premade.apply(this, arguments);
}

ClientPremade.prototype = Object.create(Premade.prototype);
ClientPremade.prototype.constructor = ClientPremade;

ClientPremade.prototype.step = function(data)
{
    while (data.length) {
        var action = data.pop();
        var id = action[0];
        var method = action[1];
        var args = action[2];

        var item = this.field.get(id);
        item[method].apply(item, args);
    }

    this.field.step();
};


ServerPremade.types = ClientPremade.types = Premade.types = {
    'classic': {
        'levels': 35
    },
    'teamvsteam': {
        'levels': 1
    }
};

ServerPremade.prototype.step = function()
{
    var self = this;
    this.users.map(function (user) {
        user.clientMessage('step', self.stepActions);
    });

    while (this.stepActions.length) {
        var action = this.stepActions.pop();
        var id = action[0];
        var method = action[1];
        var args = action[2];

        var item = this.field.get(id);
        item[method].apply(item, args);
    }

    this.field.step();
};

if (func.isClient()) {
    module.exports = ClientPremade;
} else {
    module.exports = ServerPremade;
}
