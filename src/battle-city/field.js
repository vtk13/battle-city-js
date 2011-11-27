Field = function Field(width, height)
{
    this.width      = width;
    this.height     = height;
    this.objects    = null;
    this.clear();
    this.setMaxListeners(100); // @todo
};

Eventable(Field.prototype);

Field.autoIncrement = 1; // todo eliminate?

Field.prototype.clear = function()
{
    this.objects = new MapTiled(this.width, this.height);
};

Field.prototype.add = function(object)
{
    if (object.id === undefined) {
        object.id = Field.autoIncrement++;
    }
    object.field = this;
    this.objects.add(object);
    if (!isClient()) {
        this.emit('add', object);
        var self = this;
        object.on('change', function(){
            self.emit('change', this);
        });
        object.onAddToField && object.onAddToField();
    }
};

Field.prototype.remove = function(object)
{
    if (this.objects.remove(object)) {
        this.emit('remove', object);
        object.removeAllListeners && object.removeAllListeners();
    }
};

Field.prototype.setXY = function(item, newX, newY)
{
    return this.objects.setXY(item, newX, newY);
};

Field.prototype.move = function(item, newX, newY)
{
    return this.objects.move(item, newX, newY);
};

/**
 *
 * @param object AbstractGameObject
 * @return
 */
Field.prototype.intersect = function(object, newX, newY, boundX, boundY)
{
    return this.objects.intersects(object, newX, newY, boundX, boundY);
};

Field.prototype.terrain = function(map)
{
    this.add(new Delimiter(           - 20, this.height /  2,             20, this.height / 2));
    this.add(new Delimiter(this.width + 20, this.height /  2,             20, this.height / 2));
    this.add(new Delimiter(this.width /  2,             - 20, this.width / 2,              20));
    this.add(new Delimiter(this.width /  2, this.height + 20, this.width / 2,              20));

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
            case 5:
                this.add(new Ice(x*16+8, y*16+8));
                break;
            }
        }
    }

//    this.add(new BonusTimer(10*16, 20*16));
};

Field.prototype.traversal = function(callback, thisObj)
{
    this.objects.traversal(callback, thisObj);
};

Field.prototype.canPutTank = function(x, y)
{
    var res = true;
    var intersects = this.intersect({}, x, y, 16, 16);
    for (var i in intersects) {
        if (!(intersects[i] instanceof Bonus)) {
            res = false;
        }
    };
    return res;
};

//===== client methods =========================================================

/**
 * todo almost copy of TList.prototype.updateWith
 */
Field.prototype.updateWith = function(events)
{
    for (var i in events) {
        var eventType = events[i][0/*type*/];
        var eventData = events[i][1/*data*/];
        var type = unserializeTypeMatches[eventData[0/*type*/]];
        var id = parseInt(eventData[1/*id*/]);
        switch (eventType) {
        case 'r'/*remove*/:
            if (obj = this.objects.get(id)) {
                obj.unserialize(eventData); // for bullets finalX and finalY
                this.remove(obj);
            }
            break;
            case 'a'/*add*/:
            case 'c'/*change*/:
                var obj = this.objects.get(id);
                if (obj) {
                    obj.unserialize(eventData);
                } else {
                    obj = new (window[type])();
                    obj.unserialize(eventData);
                    this.add(obj);
                }
                break;
        }
    }
};
