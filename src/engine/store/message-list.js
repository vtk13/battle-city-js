var Collection = require('src/engine/store/collection.js');

function MessageList(users)
{
    Collection.call(this);

    this.sayListeners = {};

    var self = this;
    users.on('add', function(user) {
        self.sayListeners[user.id] = function(message) {
            self.say(message);
        };
        user.on('say', self.sayListeners[user.id]);
    });
    users.on('remove', function(user) {
        delete self.sayListeners[user.id];
    });
}

MessageList.prototype = Object.create(Collection.prototype);
MessageList.prototype.constructor = MessageList;

MessageList.prototype.say = function(message)
{
    this.add(message);
    for (var i in this.items) {
        if (this.items[i].time + 5 * 60 * 1000 < Date.now()) {
            this.remove(this.items[i]);
        }
    }
};

module.exports = MessageList;
