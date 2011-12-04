/**
 * drawable
 * coordinates
 */

Checkpoint = function Checkpoint(x, y)
{
    AbstractGameObject.call(this, 16, 16);
    this.x = x;
    this.y = y;
    this.z = 0;
    this.img[0] = 'img/checkpoint.png';
};

Checkpoint.prototype = new AbstractGameObject();
Checkpoint.prototype.constructor = Checkpoint;

Eventable(Checkpoint.prototype);

Checkpoint.prototype.serialize = function()
{
    return [
        serializeTypeMatches[this.constructor.name], // 0
        this.id, // 1
        this.x,
        this.y
    ];
    // z is constant
};

Checkpoint.prototype.unserialize = function(data)
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

Checkpoint.prototype.hit = function(bullet)
{
    return false;
};
