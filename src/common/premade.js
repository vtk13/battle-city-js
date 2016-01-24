var Emitter = require('component-emitter');
var func = require('src/common/func.js');
var Collection = require('src/engine/store/collection.js');
var Clan = require('src/battle-city/clan.js');
var BotsClan = require('src/battle-city/bots-clan.js');
var Field = require('src/battle-city/field.js');

module.exports = func.isClient() ? ClientPremade : ServerPremade;
module.exports.stepInterval = 30;

ServerPremade.types = ClientPremade.types = Premade.types = {
    'classic': {
        'levels': 35
    },
    'teamvsteam': {
        'levels': 1
    }
};

function Premade(name, type)
{
    // PremadeList assume name is readonly
    // can't make it realy readonly due to serialization
    this.name = name;
    this.level = 1;
    this.userCount = 0; // @deprecated in case of this.users exists on client - this.users.length should be used
    this.locked = false; // lock for new users

    this.users = new Collection();
    this.messages = new Collection();
    this.setType(type || 'classic');

    this.stepActions = [];

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

Premade.prototype.unjoin = function(user)
{
    user.unwatchCollection('premade.users');
    user.unwatchCollection('premade.messages');
    user.clan.detachUser(user);
    this.users.remove(user);
    this.userCount--;
    user.premade = null;
    this.emit('change');
    if (this.userCount == 0) {
        this.emit('empty');
        this.removed = true; // dirty hack
    }
};

Premade.prototype.control = function(user, event)
{
    if (event.id) {
        if (event.turn) {
            this.stepActions.push([event.id, 'turn', [event.turn]]);
        }
        if (event.startMove) {
            this.stepActions.push([event.id, 'startMove', []]);
        }
        if (event.stopMove) {
            this.stepActions.push([event.id, 'stopMove', []]);
        }
        if (event.fire) {
            this.stepActions.push([event.id, 'fire', []]);
        }
    } else {
        console.log('Event without id', event);
    }
};

Premade.prototype.lock = function()
{
    this.locked = true;
    this.emit('change');
};

//===== ClientPremade ========================================================================

function ClientPremade(name, type)
{
    Premade.call(this, name, type);
}

ClientPremade.prototype = Object.create(Premade.prototype);
ClientPremade.prototype.constructor = ClientPremade;

ClientPremade.prototype.step = function(data)
{
    //console.log(data);
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

ClientPremade.prototype.startGame = function(level)
{
    this.level = level;
    this.locked = true;
    var levelData = require('src/battle-city/maps/' + this.type + '/level' + this.level + '.js');

    this.running = true;
    this.field.terrain(levelData.getMap());
    this.field.add(this.clans[0]);
    this.field.add(this.clans[1]);

    this.clans[0].startGame(levelData);
    this.clans[1].startGame(levelData);

    this.emit('change');
};

ClientPremade.prototype.join = function(user, clanId)
{
    clanId = clanId || 0;
    if (this.type == 'teamvsteam' && this.clans[clanId].isFull()) {
        clanId = 1;
    }
    if (!this.locked && !this.clans[clanId].isFull()) {
        // todo extract to user method setPremade()
        if (user.premade) {
            user.premade.unjoin(user);
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
    } else {
        throw {message: 'К этой игре уже нельзя присоединиться.'};
    }
};

ClientPremade.prototype.gameOver = function(winnerClan)
{
    if (this.running) {
        this.running = false;
        if (this.type == 'classic' && this.clans[0] == winnerClan) {
            this.level++;
            if (this.level > Premade.types[this.type].levels) {
                this.level = 1;
            }
            this.emit('change');
        }
        this.emit('gameover', winnerClan.n);
    }
};

//===== ServerPremade ========================================================================

function ServerPremade(name, type)
{
    Premade.call(this, name, type);

    this.stepIntervalId = null;
    var self = this;
    this.on('empty', function() {
        clearInterval(self.stepIntervalId);
    });
}

ServerPremade.prototype = Object.create(Premade.prototype);
ServerPremade.prototype.constructor = ServerPremade;

ServerPremade.prototype.step = function()
{
    var self = this;
    this.users.map(function(user) {
        user.clientMessage('step', self.stepActions);
    });
    this.stepActions = [];

    //ClientPremade.prototype.step.call(this, this.stepActions);
};

ServerPremade.prototype.startGame = function(level)
{
    if (this.running) {
        return false;
    }

    this.level = level;
    this.locked = true;
    this.running = true;

    this.users.map(function(user) {
        if (user.premade.type == 'teamvsteam') {
            user.lives = 4;
            user.emit('change');
        }
        user.clientMessage('started', this.level);
    }, this);

    this.stepActions = [];
    this.stepIntervalId = setInterval(this.step.bind(this), module.exports.stepInterval);
    this.emit('change');
};

ServerPremade.prototype.join = function(user, clanId)
{
    clanId = clanId || 0;
    if (this.type == 'teamvsteam' && this.clans[clanId].isFull()) {
        clanId = 1;
    }
    if (!this.locked && !this.clans[clanId].isFull()) {
        // todo extract to user method setPremade() ?
        if (user.premade) {
            user.premade.unjoin(user);
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

ServerPremade.prototype.gameOver = function(winnerClanId)
{
    if (this.stepIntervalId) {
        this.running = false;
        var stepIntervalId = this.stepIntervalId;
        this.stepIntervalId = null;
        setTimeout(function() {
            clearInterval(stepIntervalId);
        }, 2000); // stop simulation after 2 seconds

        if (this.type == 'teamvsteam') {
            this.locked = false;
        }

        this.emit('change');

        this.users.map(function(user) {
            user.clientMessage('gameover', {
                winnerClanId: winnerClanId
            });
        });
    }
};
