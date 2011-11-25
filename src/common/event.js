// test is this node.js or browser
if (typeof require == 'function') {
    EventEmitter = require('events').EventEmitter;
}

Eventable = function Eventable(object)
{
    for (var i in EventEmitter.prototype) {
        object[i] = EventEmitter.prototype[i];
    }
};
