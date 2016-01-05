define(['src/battle-city/objects/abstract.js'], function(AbstractGameObject) {
    function OnFieldAnimation(step, hw, hh)
    {
        AbstractGameObject.call(this, hw, hh);
        this.firstStep = step;
    };

    OnFieldAnimation.prototype = Object.create(AbstractGameObject.prototype);
    OnFieldAnimation.prototype.constructor = OnFieldAnimation;

    function BulletHitAnimation(step, x, y)
    {
        OnFieldAnimation.call(this, step, 16, 16);
        this.x = x;
        this.y = y;
        this.img[0] = 'img/hit1.png';
    };

    BulletHitAnimation.prototype = Object.create(OnFieldAnimation.prototype);
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

    function TankHitAnimation(step, x, y)
    {
        OnFieldAnimation.call(this, step, 16, 16);
        this.x = x;
        this.y = y;
        this.img[0] = 'img/hit1.png';
    };

    TankHitAnimation.prototype = Object.create(OnFieldAnimation.prototype);
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

    return {
        OnFieldAnimation: OnFieldAnimation,
        BulletHitAnimation: BulletHitAnimation,
        TankHitAnimation: TankHitAnimation
    };
});