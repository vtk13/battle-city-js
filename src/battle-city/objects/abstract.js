
AbstractGameObject = function AbstractGameObject(hw, hh)
{
 // for intersection (when speedX > hw)
    this.hw = this.boundX = hw;
  //for intersection (when speedY > hh)
    this.hh = this.boundY = hh;
    this.speedX; // set only through setSpeedX()
    this.speedY; // set only through setSpeedY()
    this.img = [];
};

AbstractGameObject.prototype.z = 1;

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

// sample
AbstractGameObject.prototype.serialize = function()
{
    // zero element is always type, first - id
    return [
        battleCityTypesSerialize['AbstractGameObject'],
        this.id
        // ...
    ];
};

//sample
AbstractGameObject.prototype.unserialize = function(data)
{
    this.id = data[1];
    // ...
};
