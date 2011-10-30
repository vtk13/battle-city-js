/**
 * drawable
 * coordinates
 */

Water = function Water(x, y)
{
    this.x = x;
    this.y = y;
    this.z = 1;
    this.hw = 8; // half width
    this.hh = 8; // half height
    this.setImage('img/water1.png');
};

Water.prototype = new AbstractGameObject();

Eventable(Water.prototype);

Water.prototype.serialize = function()
{
    return {
        type: 'Water',
        id: this.id,
        x: this.x,
        y: this.y,
        z: this.z
    };
};

Water.prototype.unserialize = function(data)
{
    this.id = data.id;
    this.x = data.x;
    this.y = data.y;
    this.z = data.z;
};

Water.prototype.hit = function(bullet)
{
    return false;
};
