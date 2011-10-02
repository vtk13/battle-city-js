Field = function Field(width, height)
{
    this.width      = width;
    this.height     = height;
    this.objects    = new Array(); // todo TList?
    this.setMaxListeners(100);
};

Eventable(Field.prototype);
if (typeof Loggable == 'function') {
    Loggable(Field.prototype);
}

Field.autoIncrement = 1;

Field.prototype.addObject = function(object)
{
    if (typeof object['id'] == 'undefined') {
        object.id = Field.autoIncrement++;
    }
    object.field = this;
    this.objects.push(object);
    this.emit('addObject', {type: 'addObject', object: object});
};

Field.prototype.removeObject = function(object)
{
    for (var i in this.objects) {
        if (this.objects[i] == object) {
            this.objects.splice(i, 1);
            this.emit('removeObject', {type: 'removeObject', object: object});
        }
    }
};

/**
 * game logic functions
 */

Field.prototype.intersect = function(object)
{
    var res = [];
    for (var i in this.objects) {
        // current compared object
        var o = this.objects[i];
        if (o == object) continue;
        if (Math.abs(o.x - object.x) < o.hw + object.hw &&
            Math.abs(o.y - object.y) < o.hh + object.hh) {
            res.push(o);
        }
    }
    return res;
};

Field.prototype.updateWith = function(data)
{
    for (var i in data) {
        var event = data[i];
        switch (event.type) {
            case 'removeObject':
                for (var i in this.objects) {
                    if (this.objects[i].id == event.data.id) {
                        this.objects.splice(i, 1);
                        break;
                    }
                }
                break;
            case 'addObject':
            case 'change':
                var found = false;
                for (var i in this.objects) {
                    if (this.objects[i].id == event.data.id) {
                        found = true;
                        this.objects[i].unserialize(event.data);
                    }
                }
                if (!found) {
                    var object = new (window[event.data.type])();
                    object.unserialize(event.data);
                    this.addObject(object);
                }
                break;
        }
    }
};

Field.prototype.clear = function()
{
    this.objects = new Array();
};
