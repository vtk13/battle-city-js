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
    this.setImage('img/trees.png');
};

Trees.prototype = new AbstractGameObject();
Trees.prototype.constructor = Trees;

Eventable(Trees.prototype);

Trees.prototype.serialize = function()
{
    return {
        type: 'Trees',
        id: this.id,
        x: this.x,
        y: this.y,
        z: this.z
    };
};

Trees.prototype.unserialize = function(data)
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

Trees.prototype.hit = function(bullet)
{
    return false;
};
