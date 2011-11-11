
AbstractGameObject = function AbstractGameObject(hw, hh)
{
    this.z = 1;
 // for intersection (when speedX > hw)
    this.hw = this.boundX = hw;
  //for intersection (when speedY > hh)
    this.hh = this.boundY = hh;
};

AbstractGameObject.prototype.setImage = function(img1/*, img2, ...*/)
{
    this.img = arguments;
};

AbstractGameObject.prototype.setSpeedX = function(value)
{
    this.speedX = value;
    this.boundX = this.speedX ? Math.max(this.hw, Math.abs(this.speedX)) : this.hw;
};

AbstractGameObject.prototype.setSpeedY = function(value)
{
    this.speedY = value;
    this.boundY = this.speedY ? Math.max(this.hh, Math.abs(this.speedY)) : this.hh;
};

// this is for properly work boundX and boundY
BoundObject = function BoundObject(id, x, y, hw, hh, speedX, speedY)
{
    AbstractGameObject.call(this, hw, hh);
    this.id = id;
    this.x = x;
    this.y = y;
    this.setSpeedX(speedX);
    this.setSpeedY(speedY);
};
BoundObject.prototype = new AbstractGameObject();
BoundObject.prototype.constructor = BoundObject;
