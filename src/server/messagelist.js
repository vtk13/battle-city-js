
TMessageList = function TMessageList()
{
};

TMessageList.prototype = new TList();
TMessageList.prototype.constructor = TMessageList;

TMessageList.prototype.say = function(message)
{
    this.add(message);
    for (var i in this.items) {
        if (this.items[i].time + 5 * 60 * 1000 < Date.now()) {
            this.remove(this.items[i]);
        }
    }
};
