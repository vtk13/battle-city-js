var Emitter = require('component-emitter');

function Message(text)
{
    this.time = Date.now();
    this.text = text;
}

Emitter(Message.prototype);

module.exports = Message;
