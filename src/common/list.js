
/**
 * Don't call Array methods which modify items, because they don't emit events.
 */
TList = function TList()
{
    this.items = [];
};

Eventable(TList.prototype);

TList.prototype.get = function(id)
{
    return this.items[id];
};

TList.prototype.add = function(item)
{
    if (item.id !== undefined) {
        this.items[item.id] = item;
    } else {
        item.id = this.items.push(item) - 1;
    }

    this.emit('add', item);

    var self = this;
    if (item.on) {
        item.on('change', function(){
            self.emit('change', this);
        });
    }
};

TList.prototype.remove = function(item)
{
    this.emit('remove', item);
    delete this.items[item.id];
};

TList.prototype.clear = function()
{
    for (var i in this.items) {
        this.emit('remove', this.items[i]);
        delete this.items[i];
    }
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
    this.emit('remove', item);
    delete this.items[i];
    return item;
};

TList.prototype.getFirst = function(filter)
{
    for (var i in this.items) {
        if (filter) {
            if (filter(this.items[i])) {
                return this.items[i];
            }
        } else {
            return this.items[i];
        }
    }
    return null;
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

TList.prototype.updateWith = function(events){
    for (var i in events) {
        var eventType = events[i][0/*type*/];
        var eventData = events[i][1/*data*/];
        var type = unserializeTypeMatches[eventData[0/*type*/]];
        var id = parseInt(eventData[1/*id*/]);
        switch (eventType) {
        case 'r'/*remove*/:
            if (obj = this.items[id]) {
                obj.unserialize(eventData); // for bullets finalX and finalY
                this.remove(obj);
            }
            break;
            case 'a'/*add*/:
            case 'c'/*change*/:
                var obj = this.items[id];
                if (obj) {
                    obj.unserialize(eventData);
                    this.emit('change', obj);
                } else {
                    obj = new (window[type])();
                    obj.unserialize(eventData);
                    this.add(obj);
                }
                break;
        }
    }
};

/**
 * Bind object to list.
 * All changes in a list's object with same id will reflect in the slaveObject.
 * @param slaveObject
 * @return
 */
TList.prototype.bindSlave = function(slaveObject)
{
    var self = this;
    var handler = function(each) {
        if (slaveObject.id === each.id) { // id may be 0 or undefined, so ===
            slaveObject.unserialize(each.serialize());
            slaveObject.emit('change');
        }
    };
    this.on('add'   , handler);
    this.on('change', handler);
    this.on('remove', handler);

};
