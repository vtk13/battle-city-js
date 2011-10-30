Field = function Field(width, height)
{
    this.width      = width;
    this.height     = height;
    this.objects    = null;
    this.clear();
    this.setMaxListeners(100); // @todo
};

Eventable(Field.prototype);
if (typeof Loggable == 'function') {
    Loggable(Field.prototype);
}

Field.autoIncrement = 1; // todo eliminate?

Field.prototype.clear = function()
{
    this.objects = new MapArrayed(); // todo MapTree
};

Field.prototype.add = function(object)
{
    if (typeof object.id == 'undefined') {
        object.id = Field.autoIncrement++;
    }
    object.field = this;
    this.objects.add(object);
    this.emit('add', {type: 'add', object: object});
};

Field.prototype.remove = function(object)
{
    if (this.objects.remove(object)) {
        this.emit('remove', {type: 'remove', object: object});
    }
};

Field.prototype.move = function(item, newX, newY)
{
    return this.objects.move(item, newX, newY);
};

Field.prototype.intersect = function(object)
{
    return this.objects.intersects(object);
};

Field.prototype.terrain = function(map)
{
    // todo move from this function
    for (var i = 0 ; i < 10; i++) {
        this.game.botStack.add(new TankBot(0, 0, true));
    }

    this.add(new Delimiter(           - 20, this.height /  2,             20, this.height / 2));
    this.add(new Delimiter(this.width + 20, this.height /  2,             20, this.height / 2));
    this.add(new Delimiter(this.width /  2,             - 20, this.width / 2,              20));
    this.add(new Delimiter(this.width /  2, this.height + 20, this.width / 2,              20));
    this.add(new      Base(this.width /  2, this.height - 16));

    for (var y = 0 ; y < 26 ; y++) {
        for (var x = 0 ; x < 26 ; x++) {
            switch (map[y][x]) {
            case 1:
                this.add(new Wall(x*16+ 4, y*16+ 4));
                this.add(new Wall(x*16+12, y*16+ 4));
                this.add(new Wall(x*16+ 4, y*16+12));
                this.add(new Wall(x*16+12, y*16+12));
                break;
            case 2:
                this.add(new SteelWall(x*16+8, y*16+8));
                break;
            case 3:
                this.add(new Trees(x*16+8, y*16+8));
                break;
            case 4:
                this.add(new Water(x*16+8, y*16+8));
                break;
            }
        }
    }
};

// client method
Field.prototype.updateWith = function(data)
{
    for (var i in data) {
        var event = data[i];
        switch (event.type) {
            case 'remove':
                this.objects.remove(event.data);
                break;
            case 'add':
            case 'change':
                var obj = this.objects.get(event.data.id);
                if (obj) {
                    obj.unserialize(event.data);
                } else {
                    obj = new (window[event.data.type])();
                    obj.unserialize(event.data);
                    this.objects.add(obj);
                }
                break;
        }
    }
};
