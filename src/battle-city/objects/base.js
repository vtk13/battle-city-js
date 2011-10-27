
Base = function Base(x, y)
{
    this.x = x;
    this.y = y;
    this.z = 1;
    this.hw = 16; // half width
    this.hh = 16; // half height
    this.img = new Image();
    this.img.src = 'img/base.png';
};

Base.prototype = new AbstractGameObject();

Eventable(Base.prototype);

Base.prototype.serialize = function()
{
    return {
        type: 'Base',
        id: this.id,
        x: this.x,
        y: this.y,
        z: this.z
    };
};

Base.prototype.unserialize = function(data)
{
    this.id = data.id;
    this.x = data.x;
    this.y = data.y;
    this.z = data.z;
};

Base.prototype.hit = function()
{
    this.field.game.gameOver(0);
    return true;
};