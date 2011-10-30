/**
 * drawable
 * coordinates
 */

Bonus = function Bonus(x, y)
{
    this.x = x;
    this.y = y;
    this.z = 2;
    this.hw = 16; // half width
    this.hh = 16; // half height
    this.setImage('img/star.png');
};

Bonus.prototype = new AbstractGameObject();

Eventable(Bonus.prototype);

Bonus.prototype.serialize = function()
{
    return {
        type: 'Bonus',
        id: this.id,
        x: this.x,
        y: this.y,
        z: this.z
    };
};

Bonus.prototype.unserialize = function(data)
{
    this.id = data.id;
    this.x = data.x;
    this.y = data.y;
    this.z = data.z;
};

Bonus.prototype.hit = function(bullet)
{
    return false;
};
