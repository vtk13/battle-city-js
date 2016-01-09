var Tank = require('src/battle-city/objects/tank.js');
var Base = require('src/battle-city/objects/base.js');

function Clan(n, defaultArmoredTimer)
{
    this.capacity = 2; // max users
    this.n = n; // todo is this id?
    this.defaultArmoredTimer = defaultArmoredTimer;
    this.pauseTimer = 0;
    this.enemiesClan = null;
    this.users = [];
    this.tankPositions = Clan.tankPositions['clan' + n]; // todo move to BotEmitter?
}

Clan.tankPositions = {
    'clan1': [{x:  4, y: 12}, {x: 8, y: 12}],
    'clan2': [{x:  4, y:  0}, {x: 8, y:  0}]
};

Clan.prototype.attachUser = function(user)
{
    user.clan && user.clan.detachUser(user);
    for (var positionId = 0; positionId < this.capacity; positionId++) {
        if (this.users[positionId] === undefined) {
            this.users[positionId] = user;
            user.positionId = positionId;
            break;
        }
    }
    user.clan = this;
    user.emit('change');
};

Clan.prototype.detachUser = function(user)
{
    if (this.users[user.positionId] == user) {
        delete this.users[user.positionId];
        user.clan = null;
        user.emit('change');
        user.tank && user.tank.hit();
    }
};

Clan.prototype.size = function()
{
    var res = 0;
    for (var i = 0; i < this.capacity; i++) {
        if (this.users[i]) {
            res++;
        }
    }
    return res;
};

Clan.prototype.isFull = function()
{
    return this.size() == this.capacity;
};

/**
 * is this clan of classic bot team
 * @return
 */
Clan.prototype.isBots = function()
{
    return false;
};

Clan.prototype.step = function()
{
    var activeUsers = 0;
    for (var i in this.users) {
        if (this.users[i].lives >= 0) {
            this.users[i].tank.step(this.pauseTimer > 0);
            activeUsers++;
        }
    }
    if (activeUsers == 0) {
        this.premade.gameOver(this.enemiesClan, 2000);
    }
    this.pauseTimer > 0 && this.pauseTimer--;
};

Clan.prototype.startGame = function(field)
{
    this.field = field;
    for (var i in this.users) {
        var user = this.users[i];
        if (user.lives < 0) user.lives = 0; // todo hack

        if (user.tank) {
            user.tank.resetPosition();
        } else {
            this.createTank(user, i);
        }
        this.field.add(user.tank);
    }

    this.base = new Base(field.width / 2, (this.n == 1) ? (field.height - 16) : 16);
    this.base.once('hit', this.premade.gameOver.bind(this.premade, this.enemiesClan, 2000));
    field.add(this.base);
};

Clan.prototype.createTank = function(user, position)
{
    user.tank = new Tank(
        32 * this.tankPositions[position].x + 16,
        32 * this.tankPositions[position].y + 16
    );
    user.tank.user = user;
    user.tank.clan = this;
    user.tank.colorCode = this.n;

    var self = this;
    user.tank.once('hit', function() {
        user.tank = null;
        user.lives--;
        if (user.lives >= 0) {
            self.createTank(user, position);
        }
        this.emit('change');
    });

    user.emit('change'); // user.tankId
};

Clan.prototype.pauseTanks = function()
{
    this.pauseTimer = 3 * 30; // 30 steps per second
};

module.exports = Clan;
