/**
 * public interface:
 * void add(item)
 * bool remove(item)
 * bool move(item, newX, newY)
 * object[] intersects(item)
 */
MapArrayed = function MapArrayed()
{
    this.items = new Array();
};

MapArrayed.prototype.add = function(item)
{
    this.items[item.id] = item;
};

MapArrayed.prototype.get = function(id)
{
    return this.items[id];
};

MapArrayed.prototype.remove = function(item)
{
    if (this.items[item.id]) {
        delete this.items[item.id];
        return true;
    } else {
        return false;
    }
};

MapArrayed.prototype.move = function(item, newX, newY)
{
    var items = this.intersects(new BoundObject(item.id, newX, newY, item.hw, item.hh, item.speedX, item.speedY));
    if (items.length == 0 || (item.onIntersect && item.onIntersect(items))) {
        item.x = newX;
        item.y = newY;
        return true;
    } else {
        return false;
    }
};

MapArrayed.prototype.intersects = function(item)
{
    var res = [];
    for (var i in this.items) {
        var each = this.items[i];
        if (each.id == item.id) continue;
        if (Math.abs(each.x - item.x) < (each.boundX + item.boundX) &&
            Math.abs(each.y - item.y) < (each.boundY + item.boundY)) {
            res.push(each);
        }
    }
    return res;
};

MapArrayed.prototype.forEach = function(callback, thisObj)
{
    this.items.forEach(callback, thisObj);
};
