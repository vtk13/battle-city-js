/**
 * drawable
 * coordinates
 */

Ice = function Ice(x, y)
{
    this.x = x;
    this.y = y;
    this.z = 0;
    this.hw = 8; // half width
    this.hh = 8; // half height
    this.setImage('img/ice.png');
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
    this.x = data.x;
    this.y = data.y;
    this.z = data.z;
};

Ice.prototype.hit = function(bullet)
{
    return false;
};
