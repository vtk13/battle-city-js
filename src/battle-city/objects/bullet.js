define(['src/common/func.js',
        'src/battle-city/objects/abstract.js',
        'src/common/event.js'], function(func, AbstractGameObject, Eventable) {
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
    };

    Bullet.prototype = new AbstractGameObject();
    Bullet.prototype.constructor = Bullet;

    Eventable(Bullet.prototype);

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
        return true;
    };

    Bullet.prototype.onIntersect = function(items)
    {
        var canMoveThrowItems = true;
        for (var i in items) {
            if (items[i] == this.tank) continue;
            // todo neiberhood wall can be already removed
            if (items[i].hit && items[i].hit(this)) {
                if (this.speedX) this.finalX = items[i].x - items[i].hw * func.vector(this.speedX); else this.finalX = this.x;
                if (this.speedY) this.finalY = items[i].y - items[i].hh * func.vector(this.speedY); else this.finalY = this.y;
                canMoveThrowItems = false;
            }
        }
        if (!canMoveThrowItems) {
            this.field.remove(this);
        }
        return canMoveThrowItems;
    };

    return Bullet;
});