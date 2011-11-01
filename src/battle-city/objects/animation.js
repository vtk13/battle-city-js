
OnFieldAnimation = function OnFieldAnimation(step)
{
    this.firstStep = step;
};

OnFieldAnimation.prototype = new AbstractGameObject();

BulletHitAnimation = function BulletHitAnimation(step, x, y)
{
    OnFieldAnimation.call(this, step);
    this.x = x;
    this.y = y;
    this.hw = this.hh = 16;
    this.setImage('img/hit1.png');
};

BulletHitAnimation.prototype = new OnFieldAnimation();

BulletHitAnimation.prototype.animateStep = function(step)
{
    if (step - this.firstStep > 2) {
        this.field.remove(this);
    }
    if (step - this.firstStep > 1) {
        this.setImage('img/hit2.png');
    }
};
