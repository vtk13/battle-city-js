/**
 * drawable
 * coordinates
 */

Wall = function Wall(x, y, hw, hh)
{
    AbstractGameObject.call(this, hw ? hw : 4, hh ? hh : 4);
    this.x = x;
    this.y = y;
    this.z = 1;
    this.setImage('img/brick-wall.png');
};

Wall.prototype = new AbstractGameObject();
Wall.prototype.constructor = Wall;

Eventable(Wall.prototype);

Wall.prototype.serialize = function()
{
    return {
        type: 'Wall',
        id: this.id,
        x: this.x,
        y: this.y,
        z: this.z
    };
};

Wall.prototype.unserialize = function(data)
{
    this.id = data.id;
    this.x = data.x;
    this.y = data.y;
    this.z = data.z;
};

Wall.prototype.hit = function(bullet)
{
    // coordinate for search niarest objects
    var x = this.x, y = this.y;
    if (bullet.speedX != 0) {
        switch (Math.ceil((y % 32) / 8)) {
            case 1:
            case 3:
                y += 8;
                break;
            case 2:
            case 4:
                y -= 8;
                break;
        }
    } else { // if (bullet.speedY > 0)
        switch (Math.ceil((x % 32) / 8)) {
            case 1:
            case 3:
                x += 8;
                break;
            case 2:
            case 4:
                x -= 8;
                break;
        }
    }
    this.field.remove(this);
    // after remove to avoid recusion
    var intersect = this.field.intersect(new BoundObject(null, x, y, 1, 1));
    for (var i in intersect) {
        if (typeof intersect[i]['hit'] == 'function') {
            intersect[i].hit(bullet);
        }
    }
    return true;
};

SteelWall = function SteelWall(x, y)
{
    Wall.call(this, x, y, 8, 8);
    this.setImage('img/steel-wall.png');
};

SteelWall.prototype = new Wall();
SteelWall.prototype.constructor = SteelWall;

SteelWall.prototype.serialize = function()
{
    return {
        type: 'SteelWall',
        id: this.id,
        x: this.x,
        y: this.y,
        z: this.z
    };
};

SteelWall.prototype.hit = function(bullet)
{
    if (bullet.power == 2) {
        this.field.remove(this);
    }
    return true;
};
