/**
 * public interface:
 * void add(item)
 * bool remove(item)
 * bool move(item, newX, newY)
 * object[] intersects(item)
 */
MapTiled = function MapTiled(width, height)
{
    this.all = []; // for fast traversal
    this.items = [];
    this.maxX = Math.ceil(width/this.tileSize) - 1;
    this.maxY = Math.ceil(height/this.tileSize) - 1;
    for (var x = 0 ; x <= this.maxX ; x++) {
        this.items[x] = [];
        for (var y = 0 ; y <= this.maxY ; y++) {
            this.items[x][y] = [];
        }
    }
};

MapTiled.prototype.tileSize = 16;

MapTiled.prototype.add = function(item)
{
    if (item.id === undefined) {
        console.trace();
        throw {message: 'item.id must be set', item: item};
    }
    var fromX = Math.floor((item.x-item.hw) / this.tileSize);
    if (fromX < 0) fromX = 0; else if (fromX > this.maxX) fromX = this.maxX;
    var toX   = Math.ceil ((item.x+item.hw) / this.tileSize);
    if (toX < 0) toX = 0; else if (toX > this.maxX) toX = this.maxX;
    var fromY = Math.floor((item.y-item.hh) / this.tileSize);
    if (fromY < 0) fromY = 0; else if (fromY > this.maxX) fromY = this.maxY;
    var toY   = Math.ceil ((item.y+item.hh) / this.tileSize);
    if (toY < 0) toY = 0; else if (toY > this.maxX) toY = this.maxY;
    for (var x = fromX ; x <= toX ; x++) {
        for (var y = fromY ; y <= toY ; y++) {
            this.items[x][y][item.id] = item;
        }
    }
    this.all[item.id] = item;
};

MapTiled.prototype.get = function(id)
{
    return this.all[id];
};

MapTiled.prototype.remove = function(item)
{
    if (this.all[item.id]) {
        delete this.all[item.id];
        var fromX = Math.floor((item.x-item.hw) / this.tileSize);
        if (fromX < 0) fromX = 0; else if (fromX > this.maxX) fromX = this.maxX;
        var toX   = Math.ceil ((item.x+item.hw) / this.tileSize);
        if (toX < 0) toX = 0; else if (toX > this.maxX) toX = this.maxX;
        var fromY = Math.floor((item.y-item.hh) / this.tileSize);
        if (fromY < 0) fromY = 0; else if (fromY > this.maxX) fromY = this.maxY;
        var toY   = Math.ceil ((item.y+item.hh) / this.tileSize);
        if (toY < 0) toY = 0; else if (toY > this.maxX) toY = this.maxY;
        for (var x = fromX ; x <= toX ; x++) {
            for (var y = fromY ; y <= toY ; y++) {
                delete this.items[x][y][item.id];
            }
        }
        return true;
    } else {
        return false;
    }
};

MapTiled.prototype.setXY = function(item, newX, newY)
{
    this.remove(item);
    item.x = newX;
    item.y = newY;
    this.add(item);
};

MapTiled.prototype.move = function(item, newX, newY)
{
    var items = this.intersects(item, newX, newY);
    if (items.length == 0 || (item.onIntersect && item.onIntersect(items))) {
        this.setXY(item, newX, newY);
        return true;
    } else {
        return false;
    }
};

/**
 *
 * @param item not always needed, but should be object
 * @param x int|null
 * @param y int|null
 * @param hw int|null
 * @param hh int|null
 * @return
 */
MapTiled.prototype.intersects = function(item, ix, iy, hw, hh)
{
    var res = [],
        ix = ix || item.x,
        iy = iy || item.y,
        hw = hw || item.boundX,
        hh = hh || item.boundY;
    var fromX = Math.floor((ix-hw) / this.tileSize);
    if (fromX < 0) fromX = 0; else if (fromX > this.maxX) fromX = this.maxX;
    var toX   = Math.ceil ((ix+hw) / this.tileSize);
    if (toX < 0) toX = 0; else if (toX > this.maxX) toX = this.maxX;
    var fromY = Math.floor((iy-hh) / this.tileSize);
    if (fromY < 0) fromY = 0; else if (fromY > this.maxX) fromY = this.maxY;
    var toY   = Math.ceil ((iy+hh) / this.tileSize);
    if (toY < 0) toY = 0; else if (toY > this.maxX) toY = this.maxY;
    for (var x = fromX ; x <= toX ; x++) {
        for (var y = fromY ; y <= toY ; y++) {
            for (var i in this.items[x][y]) {
                var each = this.items[x][y][i];
                if (each.id == item.id || res[each.id]) continue;
                if (Math.abs(each.x - ix) < (each.boundX + hw) &&
                    Math.abs(each.y - iy) < (each.boundY + hh)) {
                    res[each.id] = each;
                }
            }
        }
    }
    return res;
};

MapTiled.prototype.traversal = function(callback, thisObj)
{
    for (var i in this.all) {
        callback.call(thisObj, this.all[i]);
    }
};
