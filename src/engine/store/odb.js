var func = require('src/common/func.js');
var Emitter = require('component-emitter');
var Random = require('random-js');

module.exports = func.isClient() ? OdbProxy : Odb;

if (func.isClient()) {
    window.odb = module.exports;
}

module.exports.instance = function(value)
{
    if (value) {
        this._instance = value;
    }

    if (!this.hasOwnProperty('_instance')) {
        this._instance = new this();
    }

    return this._instance;
};

function Odb()
{
    this.items = {};
    this.nextId = 1;
}

Odb.prototype.create = function(constructor, args)
{
    // stackoverflow:/questions/1606797/use-of-apply-with-new-operator-is-this-possible
    function F() {
        return constructor.apply(this, args);
    }
    F.prototype = constructor.prototype;

    var object = new F();
    return this.add(object);
};

Odb.prototype.add = function(object)
{
    if (object.id === undefined) {
        object.id = this.nextId++;
    }

    this.items[object.id] = object;
    return object;
};

Odb.prototype.get = function(id)
{
    return this.items[id];
};

Odb.prototype.fetch = function(id)
{
    return this.items[id];
};

Odb.prototype.free = function(object)
{
    if (this.items[object.id]) {
        delete this.items[object.id];
        delete object.id;
    } else {
        throw new Error("Object with id " + object.id + " doesn't exist");
    }
};

Odb.prototype.createReferenceDescriptor = function()
{
    var id, self = this;
    return {
        enumerable: true,
        get: function() {
            return self.fetch(id);
        },
        set: function(value) {
            id = (typeof value == 'object') ? value.id : value;
        }
    };
};



function OdbProxy(socket)
{
    this.socket = socket || new Emitter();
    this.store = [];
    this.waits = [];
    this.idSeed = '';
    this.autoincrement = 1;

    var self = this;
    this.socket.on('sync', function(data) {
        if (data.users) {
            self.updateWith(data.users);
        }
        if (data.premades) {
            self.updateWith(data.premades);
        }
    });

    this.mt = Random.engines.mt19937();
    this.mt.seed(0);
}

OdbProxy.prototype.seed = function(idSeed)
{
    this.mt.seed(idSeed);
    this.idSeed = idSeed + '.';
    this.autoincrement = 1;
};

OdbProxy.prototype.random = function(min, max)
{
    min = min || 0;
    max = max || 100;
    return min + Math.abs(this.mt() % (max - min + 1));
};

OdbProxy.prototype.create = function(constructor, args)
{
    // stackoverflow:/questions/1606797/use-of-apply-with-new-operator-is-this-possible
    function F() {
        return constructor.apply(this, args);
    }
    F.prototype = constructor.prototype;

    var object = new F();
    object.id = this.idSeed + this.autoincrement++;
    this.store[object.id] = object;
    return object;
};

OdbProxy.prototype.add = function(object)
{
    if (object.id === undefined) {
        object.id = this.idSeed + this.autoincrement++;
    }
    this.store[object.id] = object;
    this.handleWaits(object.id);
    return object;
};

OdbProxy.prototype.handleWaits = function(id)
{
    if (this.waits[id]) {
        for (var i in this.waits[id]) {
            this.waits[id][i](this.store[id]);
        }
        delete this.waits[id];
    }
};

OdbProxy.prototype.get = function(id)
{
    return this.store[id];
};

OdbProxy.prototype.fetch = function(id, callback)
{
    if (callback === undefined) {
        return this.store[id];
    }
    if (this.store[id] === undefined) {
        this.wait(id, callback);
    } else {
        callback(this.store[id]);
    }
};

OdbProxy.prototype.wait = function(id, callback)
{
    if (this.waits[id] === undefined) {
        this.waits[id] = [];
        this.socket.emit('fetch', {id: id});
    }
    this.waits[id].push(callback);
};

OdbProxy.prototype.free = function(id)
{
    this.handleWaits(id);
    delete this.store[id];
};

OdbProxy.debug = function()
{
    return this.store;
};
