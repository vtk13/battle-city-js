
TankBot = function TankBot(x, y, bonus)
{
    Tank.apply(this, arguments); // call parent constructor
    this.setSpeedY(this.speed);
    this.moveOn = true;
    this.bonus = bonus;
    this.clan = null;
    this.armoredTimer = 0;
    this.fireTimer = 0; // do not fire too fast
};

TankBot.prototype = new Tank();
TankBot.prototype.constructor = TankBot;
TankBot.prototype.reward = 100;
TankBot.prototype.imgBase = 'img/normal-bot';

TankBot.prototype.step = function(paused)
{
    if ((this.birthTimer <= 0) && !paused) {
        if ((this.stuck || Math.random() < 0.03) && this.fireTimer <= 0) {
            this.fire();
            this.fireTimer = 1 * 1000/30; // 30ms step
        }
        if (this.stuck || Math.random() < 0.007) {
            // move percents
            var mp = {
                up: this.y / 500,
                right: (416 - this.x) / 416,
                down: (500 - this.y) / 500,
                left: this.x / 416
            };
            var percent = Math.random() * (mp.up + mp.right + mp.down + mp.left);
            for (var i in mp) {
                percent -= mp[i];
                if (percent < 0) {
                    this.startMove(i);
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

FastBulletTankBot = function FastBulletTankBot(x, y, bonus)
{
    TankBot.apply(this, arguments); // call parent constructor
};

FastBulletTankBot.prototype = new TankBot();
FastBulletTankBot.prototype.constructor = FastBulletTankBot;
FastBulletTankBot.prototype.reward = 200;
FastBulletTankBot.prototype.imgBase = 'img/fast-bullet-bot';
FastBulletTankBot.prototype.bulletSpeed = 8; // default speed

FastTankBot = function FastTankBot(x, y, bonus)
{
    TankBot.apply(this, arguments); // call parent constructor
};

FastTankBot.prototype = new TankBot();
FastTankBot.prototype.constructor = FastTankBot;
FastTankBot.prototype.reward = 300;
FastTankBot.prototype.imgBase = 'img/fast-bot';
FastTankBot.prototype.speed = 3; // default speed

HeavyTankBot = function HeavyTankBot(x, y, bonus)
{
    TankBot.apply(this, arguments); // call parent constructor
    this.lives = 3;
};

HeavyTankBot.prototype = new TankBot();
HeavyTankBot.prototype.constructor = HeavyTankBot;
HeavyTankBot.prototype.reward = 400;
HeavyTankBot.prototype.imgBase = 'img/heavy-bot';

