/**
 * drawable
 * coordinates
 */

Ice = function Ice(x, y)
{
    AbstractGameObject.call(this, 8, 8);
    this.x = x;
    this.y = y;
    this.z = 0;
    this.img[0] = 'img/ice.png';
};

Ice.prototype = new AbstractGameObject();
Ice.prototype.constructor = Ice;

Eventable(Ice.prototype);

Ice.prototype.serialize = function()
{
    return {
        type: 'Ice',
        id: this.id,
        x: this.x,
        y: this.y,
        z: this.z
    };
};

Ice.prototype.unserialize = function(data)
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
};

Ice.prototype.hit = function(bullet)
{
    return false;
};
