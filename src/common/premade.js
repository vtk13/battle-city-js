var Emitter = require('component-emitter');
var Collection = require('src/engine/store/collection.js');
var Clan = require('src/battle-city/clan.js');
var BotsClan = require('src/battle-city/bots-clan.js');
var Field = require('src/battle-city/field.js');

module.exports = Premade;

Premade.maxLevels = 35;
Premade.stepInterval = 30;

function Premade(name)
{
    // PremadeList assume name is readonly
    // can't make it really readonly due to serialization
    this.name = name;
    this.level = 1;

    this.users = new Collection();
    this.messages = new Collection();

    this.clans = [new Clan(1, 10*30/*~30step per seconds*/), new BotsClan(2, 10*30/*~30step per seconds*/)];
    this.clans[0].premade = this.clans[1].premade = this;
    this.clans[0].enemiesClan = this.clans[1];
    this.clans[1].enemiesClan = this.clans[0];

    this.stepActions = [];

    this.field = new Field(13*32, 13*32);

    // server data
    this.stepIntervalId = null;
    var self = this;
    this.on('empty', function() {
        clearInterval(self.stepIntervalId);
    });
}

Emitter(Premade.prototype);

Premade.prototype.say = function(message)
{
    this.messages.add(message);
    for (var i in this.messages.items) {
        if (this.messages.items[i].time + 5 * 60 * 1000 < Date.now()) {
            this.messages.remove(this.messages.items[i]);
        }
    }
};

Premade.prototype.unjoin = function(user)
{
    user.unwatchCollection('premade.users');
    user.unwatchCollection('premade.messages');
    user.clan.detachUser(user);
    this.users.remove(user);
    user.premade = null;
    this.emit('change');
    if (this.users.length == 0) {
        this.emit('empty');
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

Premade.prototype.isLocked = function()
{
    return this.running || this.clans[0].isFull();
};

//===== Client only methods ========================================================================

Premade.prototype.onStep = function(data)
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

Premade.prototype.onStartGame = function(level)
{
    this.level = level;
    this.running = true;

    var levelData = require('src/battle-city/maps/level' + this.level + '.js');
    this.field.terrain(levelData.getMap());
    this.field.add(this.clans[0]);
    this.field.add(this.clans[1]);

    this.clans[0].startGame(levelData);
    this.clans[1].startGame(levelData);

    this.emit('change');
};

Premade.prototype.gameOver = function(winnerClan)
{
    if (this.running) {
        this.running = false;
        if (this.clans[0] == winnerClan) {
            this.level++;
            if (this.level > Premade.maxLevels) {
                this.level = 1;
            }
            this.emit('change');
        }
        this.emit('gameover', winnerClan.n);
    }
};

//===== Server only methods ========================================================================

Premade.prototype.step = function()
{
    var self = this;
    var idSeed = Date.now().toString(36);
    this.users.map(function(user) {
        user.clientMessage('step', [idSeed, self.stepActions]);
    });
    this.stepActions = [];
};

Premade.prototype.startGame = function(level)
{
    if (this.running) {
        return false;
    }

    this.level = level;
    this.running = true;

    var idSeed = Date.now().toString(36);
    this.users.map(function(user) {
        user.clientMessage('started', [idSeed, this.level]);
    }, this);

    this.stepActions = [];
    this.stepIntervalId = setInterval(this.step.bind(this), module.exports.stepInterval);
    this.emit('change');
};

Premade.prototype.onGameOver = function(winnerClanN)
{
    if (this.stepIntervalId) {
        this.running = false;
        var stepIntervalId = this.stepIntervalId;
        this.stepIntervalId = null;
        setTimeout(function() {
            clearInterval(stepIntervalId);
        }, 2000); // stop simulation after 2 seconds

        this.emit('change');

        this.users.map(function(user) {
            user.clientMessage('gameover', {
                winnerClanN: winnerClanN
            });
        });
    }
};

Premade.prototype.join = function(user)
{
    if (this.isLocked()) {
        throw {message: 'К этой игре уже нельзя присоединиться.'};
    }

    if (user.premade) {
        user.premade.unjoin(user);
    }
    user.premade = this;
    this.users.add(user);

    this.clans[0].attachUser(user);
    this.emit('change');

    user.lives = 4;
    user.points = 0;
    user.emit('change');
    user.watchCollection(this.users, 'premade.users');
    user.watchCollection(this.messages, 'premade.messages');
};
