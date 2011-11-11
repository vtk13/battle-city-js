/**
 * drawable
 * coordinates
 */

Water = function Water(x, y)
{
    AbstractGameObject.call(this, 8, 8);
    this.x = x;
    this.y = y;
    this.z = 1;
    this.setImage('img/water1.png');
};

Water.prototype = new AbstractGameObject();
Water.prototype.constructor = Water;

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
