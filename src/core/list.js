
/**
 * !Don't call Array methods which modify items, because they didn't emit events!
 */
TList = function TList()
{
    this.items = [];
};

Eventable(TList.prototype);

TList.prototype.add = function(item)
{
    if (item.id !== undefined) {
        this.items[item.id] = item;
    } else {
        item.id = this.items.push(item) - 1;
    }

    this.emit('update', item, 'add');

    var list = this;
    item.on('change', function(){
        list.emit('update', this, 'change', arguments);
    });
};

TList.prototype.remove = function(item)
{
    this.emit('update', item, 'remove');
    delete this.items[item.id];
};

TList.prototype.pop = function()
{
    // do not pop()! beause of "a.pop()" != "delete a[a.length-1]"
    var i = -1;
    for (i in this.items); // not mistake
    if (i == -1) {
        return null;
    }
    var item = this.items[i];
    this.emit('update', item, 'remove');
    delete this.items[i];
    return item;
};

TList.prototype.count = function()
{
    var n = 0;
    for (var i in this.items) {
        n++;
    }
    return n;
};

TList.prototype.traversal = function(callback, thisObj)
{
    for (var i in this.items) {
        callback.call(thisObj, this.items[i]);
    }
};
