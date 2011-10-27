/**
 * drawable
 * coordinates
 */

Bullet = function Bullet(speedX, speedY)
{
    this.x = 0;
    this.y = 0;
    this.z = 1;
    // bullet is rectangle step of bullet
    this.hw = 1; // speedX > 0 ? speedX / 2 : 1; // half width
    this.hh = 1; // speedY > 0 ? speedY / 2 : 1; // half height
    this.speedX = speedX;
    this.speedY = speedY;
    this.power = 1;
    this.img = new Image();
    this.img.src = 'img/bullet.png';
};

Bullet.prototype = new AbstractGameObject();

Eventable(Bullet.prototype);

Bullet.prototype.step = function()
{
    if (this.field.move(this, this.x + this.speedX, this.y + this.speedY)) {
        this.emit('change', {type: 'change', object: this});
    }
};

Bullet.prototype.onIntersect = function(items)
{
    var res = true;
    for (var i in items) {
        // todo neiberhood wall can be already removed
        if (items[i].hit && items[i].hit(this)) {
            this.field.remove(this);
            res = false;
        }
    }
    return res;
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
        speedY: this.speedY
    };
};

Bullet.prototype.unserialize = function(data)
{
    this.id = data.id;
    this.x = data.x;
    this.y = data.y;
    this.z = data.z;
    this.speedX = data.speedX;
    this.speedY = data.speedY;
};
