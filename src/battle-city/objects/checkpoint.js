define(['src/battle-city/objects/abstract.js',
        'src/common/event.js'], function(AbstractGameObject, Eventable) {
    /**
     * drawable
     * coordinates
     */

    function Checkpoint(x, y)
    {
        AbstractGameObject.call(this, 16, 16);
        this.x = x;
        this.y = y;
        this.z = 0;
        this.img[0] = 'img/checkpoint.png';
    };

    Checkpoint.prototype = new AbstractGameObject();
    Checkpoint.prototype.constructor = Checkpoint;

    Eventable(Checkpoint.prototype);

    Checkpoint.prototype.hit = function(bullet)
    {
        return false;
    };

    return Checkpoint;
});