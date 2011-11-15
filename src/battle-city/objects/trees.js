/**
 * drawable
 * coordinates
 */

Trees = function Trees(x, y)
{
    AbstractGameObject.call(this, 8, 8);
    this.x = x;
    this.y = y;
    this.z = 2;
    this.img[0] = 'img/trees.png';
};

Trees.prototype = new AbstractGameObject();
Trees.prototype.constructor = Trees;

Eventable(Trees.prototype);

Trees.prototype.serialize = function()
{
    return [
        battleCityTypesSerialize['Trees'], // 0
        this.id, // 1
        this.x,
        this.y
    ];
    // z is constant
};

Trees.prototype.unserialize = function(data)
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

Trees.prototype.hit = function(bullet)
{
    return false;
};
