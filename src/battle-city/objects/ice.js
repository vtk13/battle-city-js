define(['src/battle-city/objects/abstract.js',
        'src/common/event.js'], function(AbstractGameObject, Eventable) {
    /**
     * drawable
     * coordinates
     */

    function Ice(x, y)
    {
        AbstractGameObject.call(this, 8, 8);
        this.x = x;
        this.y = y;
        this.z = 0;
        this.img[0] = 'img/ice.png';
    };

    Ice.prototype = new AbstractGameObject();
    Ice.prototype.constructor = Ice;

    Eventable(Ice.prototype);

    Ice.prototype.hit = function(bullet)
    {
        return false;
    };

    return Ice;
});