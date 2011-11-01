
TankBot = function TankBot(x, y, bonus)
{
    Tank.apply(this, arguments); // call parent constructor
    this.speedY = this.speed;
    this.moveOn = true;
    this.bonus = bonus;
    this.clan = 1; // bots
    this.armoredTimer = 0;
};

TankBot.prototype = new Tank();
TankBot.prototype._super = Tank.prototype;
// todo tank types
TankBot.prototype.reward = 20;

TankBot.prototype.step = function()
{
    if (this.stuck || Math.random() < 0.03) {
        this.fire();
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
    this._super.step.call(this);
};

TankBot.prototype.onBonus = function(bonus)
{

};

TankBot.prototype.hit = function(bullet)
{
    var res = this._super.hit.apply(this, arguments);
    // copy paste condition from parent::hit()
    // this.clan != bullet.clan means tank is hitted
    if (this.clan != bullet.clan && this.bonus) {
        this.field.add(new Bonus(
            Math.round((Math.random() * this.field.width  / 16 - 1)) * 16,
            Math.round((Math.random() * this.field.height / 16 - 1)) * 16
        ));
    }
    return res;
};
