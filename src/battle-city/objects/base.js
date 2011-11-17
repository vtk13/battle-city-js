
Base = function Base(x, y)
{
    AbstractGameObject.call(this, 16, 16);
    this.x = x;
    this.y = y;
    this.img[0] = 'img/base.png';
    this.shootDown = false;
    this.shootDownTimer = 5 * 1000/30; // 30ms step
};

Base.shootDownTimer = 5 * 1000/30; // 30ms step

Base.prototype = new AbstractGameObject();
Base.prototype.constructor = Base;
Base.prototype.baseEdge = {
    1:  [ {x: 11, y: 23}
        , {x: 11, y: 24}
        , {x: 11, y: 25}
        , {x: 12, y: 23}
        , {x: 13, y: 23}
        , {x: 14, y: 23}
        , {x: 14, y: 24}
        , {x: 14, y: 25}],
    2:  [ {x: 11, y: 0}
        , {x: 11, y: 1}
        , {x: 11, y: 2}
        , {x: 12, y: 2}
        , {x: 13, y: 2}
        , {x: 14, y: 2}
        , {x: 14, y: 1}
        , {x: 14, y: 0}]
};

Eventable(Base.prototype);

Base.prototype.serialize = function()
{
    return [
        battleCityTypesSerialize['Base'],
        this.id,
        this.x,
        this.y,
        this.shootDown
    ];
    // z is constant
};

Base.prototype.unserialize = function(data)
{
    this.id = data[1];
    if (this.field) {
        this.field.setXY(this, data[2], data[3]);
    } else {
        // first unserialize, before adding to field -> may set x and y directly
        this.x = data[2];
        this.y = data[3];
    }
    this.shootDown = data[4];
};

Base.prototype.hit = function()
{
    this.shootDown = true;
    this.emit('change', {type: 'change', object: this});
    return true;
};

Base.prototype.armor = function()
{
    this.armoredTimer = 10 * 1000/30; // 30ms step
    var edge = this.baseEdge[this.clan.n];
    for (var i in edge) {
        var walls = this.field.intersect(this, edge[i].x*16+8, edge[i].y*16+8, 8, 8);
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
            this.field.add(new SteelWall(edge[i].x*16+8, edge[i].y*16+8));
        }
    }
};

Base.prototype.disarm = function()
{
    var edge = this.baseEdge[this.clan.n];
    for (var i in edge) {
        var walls = this.field.intersect(this, edge[i].x*16+8, edge[i].y*16+8, 8, 8);
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
            this.field.add(new Wall(edge[i].x*16+ 4, edge[i].y*16+ 4));
            this.field.add(new Wall(edge[i].x*16+ 4, edge[i].y*16+12));
            this.field.add(new Wall(edge[i].x*16+12, edge[i].y*16+ 4));
            this.field.add(new Wall(edge[i].x*16+12, edge[i].y*16+12));
        }
    }
};

Base.prototype.step = function()
{
    if (this.shootDown) {
        this.shootDownTimer--;
        if (this.shootDownTimer <= 0) {
            this.clan.premade.gameOver(this.clan.enemiesClan);
        }
    }
    if (this.armoredTimer > 0) {
        if (--this.armoredTimer <= 0) {
            this.disarm();
        }
    }
};

Base.prototype.animateStep = function(step)
{
    if (this.shootDown) {
        this.img[0] = 'img/base-hit.png';
    }
};
