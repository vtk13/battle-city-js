
Delimiter = function Delimiter(x, y, hw, hh)
{
    AbstractGameObject.call(this, hw, hh);
    this.x = x;
    this.y = y;
    this.z = 1;
    this.hw = hw; // half width
    this.hh = hh; // half height
    this.img[0] = 'img/black.png';
};

Delimiter.prototype = new AbstractGameObject();
Delimiter.prototype.constructor = Delimiter;

Eventable(Delimiter.prototype);

Delimiter.prototype.serialize = function()
{
    return {
        type: 'Delimiter',
        id: this.id,
        x: this.x,
        y: this.y,
        z: this.z,
        hw: this.hw,
        hh: this.hh
    };
};

Delimiter.prototype.unserialize = function(data)
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
    this.hw = data.hw;
    this.hh = data.hh;
};

Delimiter.prototype.hit = function()
{
    return true;
};
