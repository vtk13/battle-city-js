var odb = new Odb();

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

Odb.prototype.referenceDescriptor = function()
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

module.exports = odb;
