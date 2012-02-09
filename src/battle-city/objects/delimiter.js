define(['src/battle-city/objects/abstract.js',
        'src/common/event.js'], function(AbstractGameObject, Eventable) {
    function Delimiter(x, y, hw, hh)
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

    Delimiter.prototype.hit = function()
    {
        return true;
    };

    return Delimiter;
});