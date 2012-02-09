define(['lib/node/events.js'], function(EventEmitter) {
    return function Eventable(object)
    {
        for (var i in EventEmitter.prototype) {
            object[i] = EventEmitter.prototype[i];
        }
    };
});