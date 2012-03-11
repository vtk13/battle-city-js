define(['src/common/collection.js'], function(Collection) {
    function MessageList()
    {
        Collection.apply(this, arguments);
    };

    MessageList.prototype = new Collection();
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

    return MessageList;
});