define(['src/engine/objects/abstract.js'], function(AbstractGameObject) {
    function BotEmitter(x, y)
    {
        AbstractGameObject.call(this, 16, 16);

        this.x = x;
        this.y = y;
    }

    BotEmitter.prototype = Object.create(AbstractGameObject.prototype);
    BotEmitter.prototype.constructor = BotEmitter;

    return BotEmitter;
});
