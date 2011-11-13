
Base = function Base(x, y)
{
    AbstractGameObject.call(this, 16, 16);
    this.x = x;
    this.y = y;
    this.z = 1;
    this.setImage('img/base.png');
};

Base.prototype = new AbstractGameObject();
Base.prototype.constructor = Base;
Base.prototype.baseEdge = [
          {x: 11, y: 23}
        , {x: 11, y: 24}
        , {x: 11, y: 25}
        , {x: 12, y: 23}
        , {x: 13, y: 23}
        , {x: 14, y: 23}
        , {x: 14, y: 24}
        , {x: 14, y: 25}
    ];

Eventable(Base.prototype);

Base.prototype.serialize = function()
{
    return {
        type: 'Base',
        id: this.id,
        x: this.x,
        y: this.y,
        z: this.z
    };
};

Base.prototype.unserialize = function(data)
{
    this.id = data.id;
    if (this.field) {
        this.field.setXY(this, data.x, data.y);
    } else {
        // first unserialize, before adding to field -> may set x and y directly
        this.x = data.x;
        this.y = data.y;
    }
    this.z = data.z;
};

Base.prototype.hit = function()
{
    this.field.game.gameOver(0);
    return true;
};

Base.prototype.step = function()
{
    if (this.armoredTimer > 0) {
        if (--this.armoredTimer <= 0) {
            for (var i in this.baseEdge) {
                var cell = this.baseEdge[i];
                var walls = this.field.intersect(this, cell.x*16+8, cell.y*16+8, 8, 8);
                var convert = true;
                for (var j in walls) {
                    if (!(walls[j] instanceof Wall)) {
                        convert = false;
                    }
                }
                if (convert) {
                    for (var j in walls) {
                        this.field.remove(walls[j]);
                    }
                    this.field.add(new Wall(cell.x*16+ 4, cell.y*16+ 4));
                    this.field.add(new Wall(cell.x*16+ 4, cell.y*16+12));
                    this.field.add(new Wall(cell.x*16+12, cell.y*16+ 4));
                    this.field.add(new Wall(cell.x*16+12, cell.y*16+12));
                }
            }
        }
    }
};
