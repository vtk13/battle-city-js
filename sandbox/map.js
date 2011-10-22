
var n = 0;
var id = 0;

// this is also object manager, so all coordinate operations should be done here

function Area(x, y, hw, hh, leaf)
{
    this.id = id++;
    this.x = x;
    this.y = y;
    this.hw = hw;
    this.hh = hh;
    this.leaf = leaf; // is this object (not area)
    // are childs leafs (true) or tree's nodes (false)
    // uses only if this.leaf is false
    this.leafs = true;
    this.childs = [];
    // childs indexes are 'id', so this.child.length don't work fine
    // uses only if this.leafs is true
    this.count = 0;
};

Area.prototype.isContainer = function()
{
    return this.leaf;
};

Area.prototype.isTerminalArea = function()
{
    return this.leafs;
};

Area.prototype._brakeIn = function()
{
    var childs = this.childs;
    this.childs = [];
    if (this.hw > this.hh) {
        this.childs[0] = new Area(this.x-this.hw/2, this.y, this.hw/2, this.hh, false);
        this.childs[1] = new Area(this.x+this.hw/2, this.y, this.hw/2, this.hh, false);
    } else {
        this.childs[0] = new Area(this.x, this.y-this.hh/2, this.hw, this.hh/2, false);
        this.childs[1] = new Area(this.x, this.y+this.hh/2, this.hw, this.hh/2, false);
    }
    this.leafs = false;
    for (var i in childs) {
        this.childs[0].add(childs[i]);
        this.childs[1].add(childs[i]);
    }
};

Area.prototype._intersect = function(item1, item2)
{
    if (item2 === undefined) {
        item2 = this;
    }
    n++;
    return (Math.abs(item2.x - item1.x) < (item2.hw + item1.hw))
        && (Math.abs(item2.y - item1.y) < (item2.hh + item1.hh));
};

Area.prototype.add = function(item)
{
    if (this._intersect(item)) {
        if (this.leafs) {
            /*16 - half size of maximum size object (most used maximum size?)*/
            if (Math.max(this.hw, this.hh)>16 && this.count >= 2) {
                this._brakeIn();
            }
        }
        if (this.leafs) {
            this.childs[item.id] = item;
            this.count++;
        } else {
            this.childs[0].add(item);
            this.childs[1].add(item);
        }
    }
};

Area.prototype._remove = function(item)
{
    if (this.childs[item.id]) {
        delete this.childs[item.id];
        this.count--;
    }
};

Area.prototype.remove = function(item, from)
{
    if (from === undefined) {
        from = this.intersects(item, true);
    }
    for (var i in from) {
        if (from[i].isTerminalArea()) {
            from[i]._remove(item);
        } else {
            from[i].remove(item, from[i].childs);
        }
    }

};

Area.prototype.move = function(item, newX, newY)
{
//    var intersects = this.intersects(item, true);
};

Area.prototype.intersects = function(item, withTerminalAreas, res)
{
    if (res === undefined) {
        res = [];
    }
    if (this._intersect(item)) {
        if (this.leafs) {
            for (var i in this.childs) {
                var each = this.childs[i];
                if (this._intersect(item, each)) {
                    res[each.id] = each;
                }
            }
            if (withTerminalAreas) {
                res[this.id] = this;
            }
        } else {
            for (var i in this.childs) {
                this.childs[i].intersects(item, withTerminalAreas, res);
            }
        }
    }
    return res;
};

Area.prototype.toShortString = function()
{
    return '<' + this.x + ':' + this.y + ':' + this.hw + ':' + this.hh + '>';
};

Area.prototype.toString = function()
{
    var res;
    if (this.leafs) {
        res = '[' + this.toShortString() + '\n';
        for (var i in this.childs) {
            res += '  (' + this.childs[i].toShortString() + ')';
        }
        res += '\n]\n';
    } else {
        res = '[' + this.toShortString() + '\n';
        for (var i in this.childs) {
            res += '  ' + this.childs[i].toString().split('\n').join('\n  ').trimRight() + '\n';
        }
        res += ']\n';
    }
    return res;
};

Area.prototype.terrain = function(map)
{
    this.add(new Area(           - 20, this.height /  2,             20, this.height / 2, true));
    this.add(new Area(this.width + 20, this.height /  2,             20, this.height / 2, true));
    this.add(new Area(this.width /  2,             - 20, this.width / 2,              20, true));
    this.add(new Area(this.width /  2, this.height + 20, this.width / 2,              20, true));
    this.add(new Area(this.width /  2, this.height - 16,             16,              16, true));

    for (var y = 0 ; y < 26 ; y++) {
        for (var x = 0 ; x < 26 ; x++) {
            switch (map[y][x]) {
            case 1:
                this.add(new Area(x*16+ 4, y*16+ 4, 4, 4, true));
                this.add(new Area(x*16+12, y*16+ 4, 4, 4, true));
                this.add(new Area(x*16+ 4, y*16+12, 4, 4, true));
                this.add(new Area(x*16+12, y*16+12, 4, 4, true));
                break;
            case 2:
                this.add(new Area(x*16+8, y*16+8, 8, 8, true));
                break;
            case 3:
                this.add(new Area(x*16+8, y*16+8, 8, 8, true));
                break;
            }
        }
    }
};

var area = new Area(13*32/2, 13*32/2, 13*32/2, 13*32/2, false);

var map = require('../src/battle-city/maps/level1.js');
area.terrain(map.map);

n = 0;
var qwe = area.intersects(new Area(140, //Math.round(Math.random()*13*32),
                                   140, //Math.round(Math.random()*13*32),
                                   16, 16, true), true);
console.log(qwe);
console.log(n);

//var i;
//
//area.add(new Area(10, 10, 5, 5, true));
//area.add(i = new Area(10, 10, 5, 5, true));
//area.add(new Area(10, 10, 5, 5, true));
//area.remove(i);
//
//console.log(area.toString());
