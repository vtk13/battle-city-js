
AbstractGameObject = function AbstractGameObject()
{
    this.z = 1;
};

AbstractGameObject.prototype.setImage = function(img1/*, img2, ...*/)
{
    this.img = arguments;
};

// for intersection (when speedX > hw)
AbstractGameObject.prototype.boundX = function()
{
    return (this.speedX ? Math.max(this.hw, this.speedX) : this.hw);
};

//for intersection (when speedY > hh)
AbstractGameObject.prototype.boundY = function()
{
    return (this.speedY ? Math.max(this.hh, this.speedY) : this.hh);
};

// this is for properly work boundX() and boundY()
BoundObject = function BoundObject(id, x, y, hw, hh, speedX, speedY)
{
    this.id = id;
    this.x = x;
    this.y = y;
    this.hw = hw;
    this.hh = hh;
    this.speedX = speedX;
    this.speedY = speedY;
};
BoundObject.prototype = new AbstractGameObject();
BoundObject.prototype.constructor = BoundObject;
