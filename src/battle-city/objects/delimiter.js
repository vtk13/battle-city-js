
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
    return [
        serializeTypeMatches['Delimiter'], // 0
        this.id, // 1
        this.x,
        this.y,
        this.hw,
        this.hh
    ];
};

Delimiter.prototype.unserialize = function(data)
{
    this.id = data[1];
    if (this.field) {
        this.field.setXY(this, data[2], data[3]);
    } else {
        // first unserialize, before adding to field -> may set x and y directly
        this.x = data[2];
        this.y = data[3];
    }
    this.hw = data[4];
    this.hh = data[5];
};

Delimiter.prototype.hit = function()
{
    return true;
};
