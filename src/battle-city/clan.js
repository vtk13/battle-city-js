var Tank = require('src/battle-city/objects/tank.js');
var Base = require('src/battle-city/objects/base.js');
var Odb = require('src/engine/store/odb.js');

module.exports = Clan;

function Clan(n, defaultArmoredTimer)
{
    this.n = n; // todo is this id?
    this.defaultArmoredTimer = defaultArmoredTimer;
    this.enemiesClan = null;
    this.userIds = [0, 0]; // for simple premade serialization
    this.tankPositions = [{x:  4, y: 12}, {x: 8, y: 12}]; // todo move to BotEmitter?
    this.field = null;
}

Clan.prototype.attachUser = function(user)
{
    for (var i in this.userIds) {
        if (this.userIds[i] == 0) {
            this.userIds[i] = user.id;
            user.positionId = i;
            break;
        }
    }
    user.clan = this;
    user.emit('change');
};

Clan.prototype.detachUser = function(user)
{
    if (this.userIds[user.positionId] == user.id) {
        delete this.userIds[user.positionId];
        user.clan = null;
        user.emit('change');
        user.tank && user.tank.hit();
    }
};

Clan.prototype.size = function()
{
    var res = 0;
    for (var i in this.userIds) {
        if (this.userIds[i] > 0) {
            res++;
        }
    }
    return res;
};

Clan.prototype.isFull = function()
{
    return this.size() == this.userIds.length;
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
    var odb = Odb.instance();
    var activeUsers = 0;
    for (var i in this.userIds) {
        var user = odb.get(this.userIds[i]);
        if (user && user.lives >= 0) {
            activeUsers++;
        }
    }
    if (activeUsers == 0) {
        this.premade.gameOver(this.enemiesClan);
    }
};

/**
 * можно сделать чтобы field мог прокидывать событие всем объектам у себя
 * (например метод broadcast),
 * и завернуть через этот механизм все вызовы step, animateStep и startGame.
 */
Clan.prototype.startGame = function()
{
    var odb = Odb.instance();
    for (var i in this.userIds) {
        var user = odb.get(this.userIds[i]);
        if (user) {
            if (user.lives < 0) user.lives = 0; // todo hack

            if (user.tank) {
                user.tank.resetPosition();
                this.field.add(user.tank);
            } else {
                this.createTank(user, i);
            }
        }
    }

    this.base = new Base(this.field.width / 2, (this.n == 1) ? (this.field.height - 16) : 16);
    this.base.once('hit', this.premade.gameOver.bind(this.premade, this.enemiesClan));
    this.field.add(this.base);
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

    this.field.add(user.tank);
    user.emit('change'); // user.tankId
};

Clan.prototype.pauseTanks = function()
{
    var odb = Odb.instance();
    for (var i in this.userIds) {
        var user = odb.get(this.userIds[i]);
        if (user && user.tank) {
            user.tank.pauseTimer = 3 * 30; // 30 steps per second
        }
    }
};
