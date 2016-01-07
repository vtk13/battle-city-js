define(['component-emitter'], function(Emitter) {
    function AbstractGameObject(hw, hh)
    {
     // for intersection (when speedX > hw)
        this.hw = this.boundX = hw;
      //for intersection (when speedY > hh)
        this.hh = this.boundY = hh;
        this.speedX = 0; // set only through setSpeedX()
        this.speedY = 0; // set only through setSpeedY()
        this.img = [];
    }

    Emitter(AbstractGameObject.prototype);

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

    return AbstractGameObject;
});
