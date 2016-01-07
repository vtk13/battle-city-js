define(['src/engine/objects/abstract.js'], function(AbstractGameObject) {
    function Ice(x, y)
    {
        AbstractGameObject.call(this, 8, 8);
        this.x = x;
        this.y = y;
        this.z = 0;
        this.img[0] = 'img/ice.png';
    }

    Ice.prototype = Object.create(AbstractGameObject.prototype);
    Ice.prototype.constructor = Ice;

    Ice.prototype.hit = function(bullet)
    {
        return false;
    };

    return Ice;
});
