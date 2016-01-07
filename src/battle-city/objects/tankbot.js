define([
    'src/engine/objects/abstract.js',
    'src/battle-city/objects/tank.js'
], function(
    AbstractGameObject,
    Tank
) {
    function TankBot(x, y, bonus)
    {
        Tank.apply(this, arguments); // call parent constructor
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

    TankBot.prototype.step = function(paused)
    {
        if ((this.birthTimer <= 0) && !paused) {
            if ((this.stuck || Math.random() < 0.03) && this.fireTimer <= 0) {
                this.fire();
                this.fireTimer = 0.5 * 1000/30; // 30ms step
            }
            if (this.stuck || Math.random() < 0.007) {
                // move percents
                var mp = {
                    'north': this.y / 500,
                    'east': (416 - this.x) / 416,
                    'south': (500 - this.y) / 500,
                    'west': this.x / 416
                };
                var percent = Math.random() * (mp['north'] + mp['east'] + mp['south'] + mp['west']);
                for (var i in mp) {
                    percent -= mp[i];
                    if (percent < 0) {
                        this.turn(i);
                        break;
                    }
                }
            }
        }
        Tank.prototype.step.call(this, paused);
    };

    TankBot.prototype.onBonus = function(bonus)
    {

    };

    function FastBulletTankBot(x, y, bonus)
    {
        TankBot.apply(this, arguments); // call parent constructor
    }

    FastBulletTankBot.prototype = Object.create(TankBot.prototype);
    FastBulletTankBot.prototype.constructor = FastBulletTankBot;

    FastBulletTankBot.prototype.reward = 200;
    FastBulletTankBot.prototype.imgBase = 'img/fast-bullet-bot';
    FastBulletTankBot.prototype.bulletSpeed = 8; // default speed

    function FastTankBot(x, y, bonus)
    {
        TankBot.apply(this, arguments); // call parent constructor
    }

    FastTankBot.prototype = Object.create(TankBot.prototype);
    FastTankBot.prototype.constructor = FastTankBot;

    FastTankBot.prototype.reward = 300;
    FastTankBot.prototype.imgBase = 'img/fast-bot';
    FastTankBot.prototype.speed = 3; // default speed

    function HeavyTankBot(x, y, bonus)
    {
        TankBot.apply(this, arguments); // call parent constructor
        this.lives = 3;
    }

    HeavyTankBot.prototype = Object.create(TankBot.prototype);
    HeavyTankBot.prototype.constructor = HeavyTankBot;

    HeavyTankBot.prototype.reward = 400;
    HeavyTankBot.prototype.imgBase = 'img/heavy-bot';

    return {
        TankBot: TankBot,
        FastBulletTankBot: FastBulletTankBot,
        FastTankBot: FastTankBot,
        HeavyTankBot: HeavyTankBot
    };
});
