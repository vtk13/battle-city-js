define([
    'src/common/func.js',
    'src/engine/map/map-tiled.js',
    'src/battle-city/objects/delimiter.js',
    'src/battle-city/objects/wall.js',
    'src/battle-city/objects/trees.js',
    'src/battle-city/objects/water.js',
    'src/battle-city/objects/ice.js',
    'src/battle-city/objects/bonus.js'
], function(
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
        MapTiled.call(this, width, height);
        this.width = width;
        this.height = height;
    }

    Field.prototype = Object.create(MapTiled.prototype);
    Field.prototype.constructor = Field;

    Field.prototype.add = function(item)
    {
        if (MapTiled.prototype.add.call(this, item)) {
            item.field = this;
            if (!func.isClient()) {
                // todo
                item.onAddToField && item.onAddToField();
            }
            return true;
        } else {
            return false;
        }
    };

    Field.prototype.remove = function(item)
    {
        if (MapTiled.prototype.remove.call(this, item)) {
            // todo
            item.removeAllListeners && item.removeAllListeners();
        }
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

    Field.prototype.canPutTank = function(x, y)
    {
        var res = true;
        var intersects = this.intersects({}, x, y, 16, 16);
        for (var i in intersects) {
            if (!(intersects[i] instanceof bonus.Bonus)) {
                res = false;
            }
        }
        return res;
    };

    return Field;
});
