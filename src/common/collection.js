/**
 *
 */
define([
    'src/common/event.js'
], function(
    Eventable
) {
    /**
     * Don't call Array's methods which modify items, because they don't emit events.
     */
    function Collection()
    {
        this.items = [];
    }

    Eventable(Collection.prototype);

    Collection.prototype.get = function(id, callback)
    {
        callback(this.items[id]);
    };

    Collection.prototype.add = function(item)
    {
        // todo remove id check (all object should be created through store/odb
        if (item.id !== undefined) {
            this.items[item.id] = item;
        } else {
            item.id = this.items.push(item) - 1;
        }

        this.emit('add', item);

        var self = this;
        if (item.on) {
            item.on('change', function() {
                self.emit('change', this);
            });
        }
    };

    Collection.prototype.remove = function(item)
    {
        this.emit('remove', item);
        delete this.items[item.id];
    };

    Collection.prototype.clear = function()
    {
        for (var i in this.items) {
            this.emit('remove', this.items[i]);
            delete this.items[i];
        }
    };

    Collection.prototype.pop = function()
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

    Collection.prototype.getFirst = function(filter)
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

    Collection.prototype.count = function()
    {
        var n = 0;
        for (var i in this.items) {
            n++;
        }
        return n;
    };

    Collection.prototype.traversal = function(callback, thisObj)
    {
        for (var i in this.items) {
            callback.call(thisObj, this.items[i]);
        }
    };

    /**
     * Bind object to list.
     *
     * All changes in a list's object with same id will reflect in the slaveObject.
     *
     * @param slaveObject
     * @return
     */
    Collection.prototype.bindSlave = function(slaveObject)
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

    return Collection;
});