var AbstractGameObject = require('src/engine/objects/abstract.js');

function BotEmitter(x, y, stack)
{
    AbstractGameObject.call(this, 16, 16);

    this.x = x;
    this.y = y;
    this.waiting = false;
    this.stack = stack;
}

BotEmitter.prototype = Object.create(AbstractGameObject.prototype);
BotEmitter.prototype.constructor = BotEmitter;

BotEmitter.prototype.step = function() {
    if (!this.waiting) {
        var next = this.stack.pop();
        this.field.add(next);
        this.waiting = true;

        var self = this;
        next.once('hit', function() {
            self.waiting = false;
        });
    }
};

module.exports = BotEmitter;
