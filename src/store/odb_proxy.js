define(function() {
    var store = [];
    var waits = [];
    var autoincrement = 1;

    function OdbProxy(source)
    {
        this.source = source;
        var self = this;
        source.on('sync', function(data) {
            if (data.users) {
                self.updateWith(data.users);
            }
            if (data.premades) {
                self.updateWith(data.premades);
            }
        });
    }

    OdbProxy.prototype.create = function(constructor, args)
    {
        // stackoverflow:/questions/1606797/use-of-apply-with-new-operator-is-this-possible
        function F() {
            return constructor.apply(this, args);
        }
        F.prototype = constructor.prototype;

        var object = new F();
        object.id = autoincrement++;
        store[object.id] = object;
        return object;
    };

    OdbProxy.prototype.add = function(object)
    {
        if (object.id === undefined) {
            object.id = autoincrement++;
        }
        store[object.id] = object;
        this.handleWaits(object.id);
        return object;
    };

    OdbProxy.prototype.handleWaits = function(id)
    {
        // ...
        if (waits[id]) {
            for (var i in waits[id]) {
                waits[id][i](store[id]);
            }
            delete waits[id];
        }
    }

    OdbProxy.prototype.fetch = function(id, callback)
    {
        if (callback === undefined) {
            return store[id];
        }
        if (store[id] === undefined) {
            this.wait(id, callback);
        } else {
            callback(store[id]);
        }
    };

    OdbProxy.prototype.wait = function(id, callback)
    {
        if (waits[id] === undefined) {
            waits[id] = [];
            this.source.emit('fetch', {id: id});
        }
        waits[id].push(callback);
    };

    OdbProxy.prototype.free = function(id)
    {
        this.handleWaits(id);
        delete store[id];
    };

    OdbProxy.debug = function()
    {
        return store;
    };

    return OdbProxy;
});