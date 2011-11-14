
OnFieldAnimation = function OnFieldAnimation(step, hw, hh)
{
    AbstractGameObject.call(this, hw, hh);
    this.firstStep = step;
};

OnFieldAnimation.prototype = new AbstractGameObject();
OnFieldAnimation.prototype.constructor = OnFieldAnimation;

BulletHitAnimation = function BulletHitAnimation(step, x, y)
{
    OnFieldAnimation.call(this, step, 16, 16);
    this.x = x;
    this.y = y;
    this.img[0] = 'img/hit1.png';
};

BulletHitAnimation.prototype = new OnFieldAnimation();
BulletHitAnimation.prototype.constructor = BulletHitAnimation;

BulletHitAnimation.prototype.animateStep = function(step)
{
    if (step - this.firstStep > 2) {
        this.field.remove(this);
    } else
    if (step - this.firstStep > 1) {
        this.img[0] = 'img/hit2.png';
    }
};

TankHitAnimation = function TankHitAnimation(step, x, y)
{
    OnFieldAnimation.call(this, step, 16, 16);
    this.x = x;
    this.y = y;
    this.img[0] = 'img/hit1.png';
};

TankHitAnimation.prototype = new OnFieldAnimation();
TankHitAnimation.prototype.constructor = TankHitAnimation;

TankHitAnimation.prototype.animateStep = function(step)
{
    if (step - this.firstStep > 5) {
        this.field.remove(this);
    } else
    if (step - this.firstStep > 3) {
        this.hw = this.hh = 32; // don't care about intersections
        this.img[0] = 'img/hit3.png';
    } else
    if (step - this.firstStep > 1) {
        this.img[0] = 'img/hit2.png';
    }
};
