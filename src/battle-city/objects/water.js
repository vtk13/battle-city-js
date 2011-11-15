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
    this.img[0] = 'img/water1.png';
};

Water.prototype = new AbstractGameObject();
Water.prototype.constructor = Water;

Eventable(Water.prototype);

Water.prototype.serialize = function()
{
    return [
            battleCityTypesSerialize['Water'], // 0
            this.id, // 1
            this.x,
            this.y
        ];
        // z is constant
};

Water.prototype.unserialize = function(data)
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

Water.prototype.hit = function(bullet)
{
    return false;
};
