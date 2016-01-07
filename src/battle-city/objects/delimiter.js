define(['src/battle-city/objects/abstract.js'], function(AbstractGameObject) {
    function Delimiter(x, y, hw, hh)
    {
        AbstractGameObject.call(this, hw, hh);
        this.x = x;
        this.y = y;
        this.z = 1;
        this.hw = hw; // half width
        this.hh = hh; // half height
        this.img[0] = 'img/black.png';
    }

    Delimiter.prototype = Object.create(AbstractGameObject.prototype);
    Delimiter.prototype.constructor = Delimiter;

    Delimiter.prototype.hit = function()
    {
        return true;
    };

    return Delimiter;
});
