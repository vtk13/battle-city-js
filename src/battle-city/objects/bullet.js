define([
    'src/common/func.js',
    'src/engine/objects/abstract.js'
], function(
    func,
    AbstractGameObject
) {
    /**
     * drawable
     * coordinates
     */
    function Bullet(speedX, speedY)
    {
        AbstractGameObject.call(this, 4, 4);
        this.x = 0;
        this.y = 0;
        this.z = 1;
        // bullet is rectangle step of bullet
        this.setSpeedX(speedX);
        this.setSpeedY(speedY);
        this.finalX = 0; // for proper hit animation (todo ugly)
        this.finalY = 0; // for proper hit animation (todo ugly)
        this.power = 1;
        this.setDirectionImage();
    }

    Bullet.prototype = Object.create(AbstractGameObject.prototype);
    Bullet.prototype.constructor = Bullet;

    Bullet.prototype.setDirectionImage = function()
    {
     var dir = 'up';
     if (this.speedY  > 0) {
         dir = 'down';
     } else if (this.speedY  < 0) {
         dir = 'up';
     } else if (this.speedX  > 0) {
         dir = 'right';
     } else if (this.speedX  < 0) {
         dir = 'left';
     }
     this.img[0] = 'img/bullet-' + dir + '.png';
    };

    Bullet.prototype.step = function()
    {
        if (this.field.move(this, this.x + this.speedX, this.y + this.speedY)) {
            this.emit('change');
        }
    };

    Bullet.prototype.hit = function()
    {
        this.field.remove(this);
        this.emit('hit');
        return true;
    };

    Bullet.prototype.onIntersect = function(items)
    {
        var hit = false;
        for (var i in items) {
            if (items[i] == this.tank) continue;
            // todo neighborhood wall can be already removed
            if (items[i].hit && items[i].hit(this)) {
                this.finalX = this.speedX ? items[i].x - items[i].hw * func.vector(this.speedX) : this.x;
                this.finalY = this.speedY ? items[i].y - items[i].hh * func.vector(this.speedY) : this.y;
                hit = true;
            }
        }
        hit && this.hit();
        return !hit;
    };

    return Bullet;
});
