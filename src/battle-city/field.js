define([
    'src/common/event.js',
    'src/common/func.js',
    'src/common/map_tiled.js',
    'src/battle-city/objects/delimiter.js',
    'src/battle-city/objects/wall.js',
    'src/battle-city/objects/trees.js',
    'src/battle-city/objects/water.js',
    'src/battle-city/objects/ice.js',
    'src/battle-city/objects/bonus.js'
], function(
    Eventable,
    func,
    MapTiled,
    Delimiter,
    wall,
    Trees,
    Water,
    Ice,
    bonus
) {
    function Field(width, height)
    {
        this.width      = width;
        this.height     = height;
        this.objects    = null;
        this.clear();
        this.setMaxListeners(100); // @todo
    }

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
        if (!func.isClient()) {
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

    Field.prototype.get = function(id)
    {
        return this.objects.get(id);
    };

    /**
     *
     * @param object AbstractGameObject
     * @param newX
     * @param newY
     * @param boundX
     * @param boundY
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
                    this.add(new wall.Wall(x*16+ 4, y*16+ 4));
                    this.add(new wall.Wall(x*16+12, y*16+ 4));
                    this.add(new wall.Wall(x*16+ 4, y*16+12));
                    this.add(new wall.Wall(x*16+12, y*16+12));
                    break;
                case 2:
                    this.add(new wall.SteelWall(x*16+8, y*16+8));
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
            if (!(intersects[i] instanceof bonus.Bonus)) {
                res = false;
            }
        }
        return res;
    };

    return Field;
});
