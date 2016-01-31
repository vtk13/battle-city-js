var AbstractGameObject = require('src/engine/objects/abstract.js');
var Odb = require('src/engine/store/odb.js');

/**
 * drawable
 * coordinates
 */

function Bonus(x, y)
{
    AbstractGameObject.call(this, 16, 16);
    this.x = x;
    this.y = y;
    this.z = 2;
}

Bonus.prototype = Object.create(AbstractGameObject.prototype);
Bonus.prototype.constructor = Bonus;

Bonus.prototype.hit = function(bullet)
{
    return false;
};

function BonusStar(x, y)
{
    Bonus.call(this, x, y);
    this.img[0] = 'img/star.png';
}

BonusStar.prototype = Object.create(Bonus.prototype);
BonusStar.prototype.constructor = BonusStar;

BonusStar.prototype.applyTo = function(tank)
{
    if (tank.maxBullets == 1) {
        tank.maxBullets = 2;
    } else if (tank.bulletPower == 1) {
        tank.bulletPower = 2;
    }
};

function BonusGrenade(x, y)
{
    Bonus.call(this, x, y);
    this.img[0] = 'img/grenade.png';
}

BonusGrenade.prototype = Object.create(Bonus.prototype);
BonusGrenade.prototype.constructor = BonusGrenade;

BonusGrenade.prototype.applyTo = function(tank)
{
    var odb = Odb.instance();
    // tank.hit() cause splice tank.clan.enemiesClan.users, so collect tanks first
    var tanks = [], i;
    var userIds = tank.clan.enemiesClan.userIds;
    for (i in userIds) {
        var user = odb.get(userIds[i]);
        if (user) {
            tanks.push(user.tank);
        }
    }
    for (i in tanks) {
        tanks[i].hit();
    }
};

function BonusShovel(x, y)
{
    Bonus.call(this, x, y);
    this.img[0] = 'img/shovel.png';
}

BonusShovel.prototype = Object.create(Bonus.prototype);
BonusShovel.prototype.constructor = BonusShovel;

BonusShovel.prototype.applyTo = function(tank)
{
    tank.clan && tank.clan.base && tank.clan.base.armor();
};

function BonusHelmet(x, y)
{
    Bonus.call(this, x, y);
    this.img[0] = 'img/helmet.png';
}

BonusHelmet.prototype = Object.create(Bonus.prototype);
BonusHelmet.prototype.constructor = BonusHelmet;

BonusHelmet.prototype.applyTo = function(tank)
{
    tank.armoredTimer = tank.clan.defaultArmoredTimer;
};

function BonusLive(x, y)
{
    Bonus.call(this, x, y);
    this.img[0] = 'img/live.png';
}

BonusLive.prototype = Object.create(Bonus.prototype);
BonusLive.prototype.constructor = BonusLive;

BonusLive.prototype.applyTo = function(tank)
{
    tank.user.lives++;
    tank.user.emit('change');
};

function BonusTimer(x, y)
{
    Bonus.call(this, x, y);
    this.img[0] = 'img/timer.png';
}

BonusTimer.prototype = Object.create(Bonus.prototype);
BonusTimer.prototype.constructor = BonusTimer;

BonusTimer.prototype.applyTo = function(tank)
{
    tank.clan.enemiesClan.pauseTanks();
};

module.exports = {
    Bonus: Bonus,
    BonusStar: BonusStar,
    BonusGrenade: BonusGrenade,
    BonusShovel: BonusShovel,
    BonusHelmet: BonusHelmet,
    BonusLive: BonusLive,
    BonusTimer: BonusTimer
};
