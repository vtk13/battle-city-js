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
    return [
        serializeTypeMatches['Ice'], // 0
        this.id, // 1
        this.x,
        this.y
    ];
    // z is constant
};

Ice.prototype.unserialize = function(data)
{
    this.id = data[1];
    if (this.field) {
        this.field.setXY(this, data[2], data[3]);
    } else {
        // first unserialize, before adding to field -> may set x and y directly
        this.x = data[2];
        this.y = data[3];
    }
};

Ice.prototype.hit = function(bullet)
{
    return false;
};
