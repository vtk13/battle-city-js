/**
 * drawable
 * coordinates
 */

Bullet = function Bullet(speedX, speedY)
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
        this.emit('change', {type: 'change', object: this});
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
            if (this.speedX) this.finalX = items[i].x - items[i].hw * vector(this.speedX); else this.finalX = this.x;
            if (this.speedY) this.finalY = items[i].y - items[i].hh * vector(this.speedY); else this.finalY = this.y;
            canMoveThrowItems = false;
        }
    }
    if (!canMoveThrowItems) {
        this.field.remove(this);
    }
    return canMoveThrowItems;
};

Bullet.prototype.serialize = function()
{
    return {
        type: 'Bullet',
        id: this.id,
        x: this.x,
        y: this.y,
        z: this.z,
        speedX: this.speedX,
        speedY: this.speedY,
        finalX: this.finalX,
        finalY: this.finalY
    };
};

Bullet.prototype.unserialize = function(data)
{
    this.id = data.id;
    if (this.field) {
        this.field.setXY(this, data.x, data.y);
    } else {
        // first unserialize, before adding to field -> may set x and y directly
        this.x = data.x;
        this.y = data.y;
    }
    this.z = data.z;
    this.setSpeedX(data.speedX);
    this.setSpeedY(data.speedY);
    this.finalX = data.finalX;
    this.finalY = data.finalY;
    this.setDirectionImage();
};
