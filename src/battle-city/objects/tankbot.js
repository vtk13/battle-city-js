var Tank = require('src/battle-city/objects/tank.js');
var Odb = require('src/engine/store/odb.js');

function TankBot(x, y, bonus)
{
    Tank.call(this, x, y); // call parent constructor
    this.setSpeedY(this.speed);
    this.moveOn = true;
    this.bonus = bonus;
    this.clan = null;
    this.armoredTimer = 0;
    this.fireTimer = 0; // do not fire too fast
}

TankBot.prototype = Object.create(Tank.prototype);
TankBot.prototype.constructor = TankBot;

TankBot.prototype.reward = 100;
TankBot.prototype.imgBase = 'img/normal-bot';

TankBot.prototype.step = function()
{
    // pauseTimer decrease in Tank.step()

    if ((this.birthTimer <= 0) && this.pauseTimer <= 0) {
        if ((this.stuck || Odb.instance().random() <= 3) && this.fireTimer <= 0) {
            this.fire();
            this.fireTimer = 0.5 * 1000/30; // 30ms step
        }
        if (this.stuck || Odb.instance().random(0, 1000) <= 7) {
            var mp = {
                north: this.y,
                east: 416 - this.x,
                south: 500 - this.y,
                west: this.x
            };
            var percent = Odb.instance().random() / 100 * (mp['north'] + mp['east'] + mp['south'] + mp['west']);
            for (var i in mp) {
                percent -= mp[i];
                if (percent < 0) {
                    this.turn(i);
                    break;
                }
            }
        }
    }
    Tank.prototype.step.call(this);
};

TankBot.prototype.onBonus = function(bonus)
{

};

function FastBulletTankBot(x, y, bonus)
{
    TankBot.call(this, x, y, bonus); // call parent constructor
}

FastBulletTankBot.prototype = Object.create(TankBot.prototype);
FastBulletTankBot.prototype.constructor = FastBulletTankBot;

FastBulletTankBot.prototype.reward = 200;
FastBulletTankBot.prototype.imgBase = 'img/fast-bullet-bot';
FastBulletTankBot.prototype.bulletSpeed = 8; // default speed

function FastTankBot(x, y, bonus)
{
    TankBot.call(this, x, y, bonus); // call parent constructor
}

FastTankBot.prototype = Object.create(TankBot.prototype);
FastTankBot.prototype.constructor = FastTankBot;

FastTankBot.prototype.reward = 300;
FastTankBot.prototype.imgBase = 'img/fast-bot';
FastTankBot.prototype.speed = 3; // default speed

function HeavyTankBot(x, y, bonus)
{
    TankBot.call(this, x, y, bonus); // call parent constructor
    this.lives = 3;
}

HeavyTankBot.prototype = Object.create(TankBot.prototype);
HeavyTankBot.prototype.constructor = HeavyTankBot;

HeavyTankBot.prototype.reward = 400;
HeavyTankBot.prototype.imgBase = 'img/heavy-bot';

module.exports = {
    TankBot: TankBot,
    FastBulletTankBot: FastBulletTankBot,
    FastTankBot: FastTankBot,
    HeavyTankBot: HeavyTankBot
};
