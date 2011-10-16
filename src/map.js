function Area(x, y, hw, hh)
{
    this.x = x;
    this.y = y;
    this.hw = hw;
    this.hh = hh;
    this.leafs = true; // are childs leafs (true) or tree's nodes (false)
    this.childs = [];
};

Area.prototype._brakeIn = function()
{
    var childs = this.childs;
    this.childs = [];
    if (this.hw > this.hh) {
        this.childs[0] = new Area(this.x-this.hw/2, this.y, this.hw/2, this.hh);
        this.childs[1] = new Area(this.x+this.hw/2, this.y, this.hw/2, this.hh);
    } else {
        this.childs[0] = new Area(this.x, this.y-this.hh/2, this.hw, this.hh/2);
        this.childs[1] = new Area(this.x, this.y+this.hh/2, this.hw, this.hh/2);
    }
    childs.forEach(function(item){
        if (this.childs[0]._intersect(item)) {
            this.childs[0].add(item);
        }
        if (this.childs[1]._intersect(item)) {
            this.childs[1].add(item);
        }
    }, this);
    this.leafs = false;
};

Area.prototype._intersect = function(item)
{
    return (Math.abs(this.x - item.x) < Math.abs(this.hw - item.hw))
        && (Math.abs(this.y - item.y) < Math.abs(this.hh - item.hh));
};

Area.prototype.add = function(item)
{
    if (this.leafs) {
        if (Math.max(this.hw, this.hh)>10 && this.childs.length >= 2) {
            this._brakeIn();
        }
    }
    if (this.leafs) {
        this.childs.push(item);
    } else {
        this.childs.forEach(function(area){
            if (area._intersect(item)) {
                area.add(item);
            }
        });
    }
};

Area.prototype.remove = function(item)
{

};

Area.prototype.intersects = function(item)
{

};

Area.prototype.toString = function()
{
    var res;
    if (this.leafs) {
        res = '[';
        for (var i in this.childs) {
            res += 'x';
        }
        res += ']\n';
    } else {
        res = '[\n';
        for (var i in this.childs) {
            res += '  ' + this.childs[i].toString().split('\n').join('\n  ').trimRight() + '\n';
        }
        res += ']\n';
    }
    return res;
};

var area = new Area(200, 200, 200, 200);

area.add(new Area(10, 10, 1, 1));
area.add(new Area(10, 10, 1, 1));
area.add(new Area(10, 10, 1, 1));
area.add(new Area(10, 10, 1, 1));
area.add(new Area(10, 10, 1, 1));

console.log(area.toString());
