define(['src/common/event.js',
        'src/battle-city/objects/abstract.js',
        'src/battle-city/objects/wall.js'], function(Eventable,
                AbstractGameObject, wall) {
    function Base(x, y)
    {
        AbstractGameObject.call(this, 16, 16);
        this.x = x;
        this.y = y;
        this.img[0] = 'img/base.png';
        this.shootDown = false;
    };

    Base.prototype = Object.create(AbstractGameObject.prototype);
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

    Base.prototype.hit = function()
    {
        this.shootDown = true;
        this.clan.premade.gameOver(this.clan.enemiesClan, 2000);
        this.emit('change');
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
                if (!(walls[j] instanceof wall.Wall)) {
                    convert = false;
                }
            }
            if (convert) {
                for (var j in walls) {
                    this.field.remove(walls[j]);
                }
                this.field.add(new wall.SteelWall(edge[i].x*16+8, edge[i].y*16+8));
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
                if (!(walls[j] instanceof wall.Wall)) {
                    convert = false;
                }
            }
            if (convert) {
                for (var j in walls) {
                    this.field.remove(walls[j]);
                }
                this.field.add(new wall.Wall(edge[i].x*16+ 4, edge[i].y*16+ 4));
                this.field.add(new wall.Wall(edge[i].x*16+ 4, edge[i].y*16+12));
                this.field.add(new wall.Wall(edge[i].x*16+12, edge[i].y*16+ 4));
                this.field.add(new wall.Wall(edge[i].x*16+12, edge[i].y*16+12));
            }
        }
    };

    Base.prototype.step = function()
    {
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

    return Base;
});