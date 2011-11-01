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
    var items = this.intersects({id: item.id, x: newX, y: newY, hw: item.hw, hh: item.hh});
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
        if (this.items[i].id == item.id) continue;
        if (Math.abs(this.items[i].x - item.x) < this.items[i].hw + item.hw &&
            Math.abs(this.items[i].y - item.y) < this.items[i].hh + item.hh) {
            res.push(this.items[i]);
        }
    }
    return res;
};

MapArrayed.prototype.forEach = function(callback, thisObj)
{
    this.items.forEach(callback, thisObj);
};
