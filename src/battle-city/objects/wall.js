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
    this.img[0] = 'img/brick-wall.png';
};

Wall.prototype = new AbstractGameObject();
Wall.prototype.constructor = Wall;

Eventable(Wall.prototype);

Wall.prototype.serialize = function()
{
    return [
        battleCityTypesSerialize[this.constructor.name], // 0
        this.id, // 1
        this.x,
        this.y
    ];
    // z is constant
};

Wall.prototype.unserialize = function(data)
{
    this.id = data[1];
    if (this.field) {
        this.field.setXY(this, data[2], data[3]);
    } else {
        // first unserialize, before adding to field -> may set x and y directly
        this.x = data[2];
        this.y = data[3];
    }
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
    var intersect = this.field.intersect(this, x, y, 1, 1);
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
    this.img[0] = 'img/steel-wall.png';
};

SteelWall.prototype = new Wall();
SteelWall.prototype.constructor = SteelWall;

SteelWall.prototype.hit = function(bullet)
{
    if (bullet.power == 2) {
        this.field.remove(this);
    }
    return true;
};
