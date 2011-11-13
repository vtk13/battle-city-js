/**
 * drawable
 * coordinates
 */

Bonus = function Bonus(x, y)
{
    AbstractGameObject.call(this, 16, 16);
    this.x = x;
    this.y = y;
    this.z = 2;
};

Bonus.prototype = new AbstractGameObject();
Bonus.prototype.constructor = Bonus;

Eventable(Bonus.prototype);

Bonus.prototype.serialize = function()
{
    return {
        type: this.constructor.name,
        id: this.id,
        x: this.x,
        y: this.y,
        z: this.z
    };
};

Bonus.prototype.unserialize = function(data)
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

Bonus.prototype.hit = function(bullet)
{
    return false;
};

BonusStar = function BonusStar(x, y)
{
    Bonus.apply(this, arguments);
    this.setImage('img/star.png');
};

BonusStar.prototype = new Bonus();
BonusStar.prototype.constructor = BonusStar;

BonusStar.prototype.applyTo = function(tank)
{
    if (tank.maxBullets == 1) {
        tank.maxBullets = 2;
    } else if (tank.bulletPower == 1) {
        tank.bulletPower = 2;
    }
};

BonusGrenade = function BonusGrenade(x, y)
{
    Bonus.apply(this, arguments);
    this.setImage('img/grenade.png');
};

BonusGrenade.prototype = new Bonus();
BonusGrenade.prototype.constructor = BonusGrenade;

BonusGrenade.prototype.applyTo = function(tank)
{
    tank.field.objects.forEach(function(item){
        if (item instanceof TankBot) {
            item.hit();
        }
    });
};

BonusShovel = function BonusShovel(x, y)
{
    Bonus.apply(this, arguments);
    this.setImage('img/shovel.png');
};

BonusShovel.prototype = new Bonus();
BonusShovel.prototype.constructor = BonusShovel;

BonusShovel.prototype.applyTo = function(tank)
{
    for (var i in Base.prototype.baseEdge) {
        var cell = Base.prototype.baseEdge[i];
        var walls = tank.field.intersect(this, cell.x*16+8, cell.y*16+8, 8, 8);
        var convert = true;
        for (var j in walls) {
            if (!(walls[j] instanceof Wall)) {
                convert = false;
            }
        }
        if (convert) {
            for (var j in walls) {
                tank.field.remove(walls[j]);
            }
            tank.field.add(new SteelWall(cell.x*16+8, cell.y*16+8));
        }
    }
    var base = tank.field.intersect(this, 12*16+8, 24*16+8, 2, 2);
    for (var i in base) {
        base[i].armoredTimer = 10 * 1000/30; // 30ms step
    }
};

BonusHelmet = function BonusHelmet(x, y)
{
    Bonus.apply(this, arguments);
    this.setImage('img/helmet.png');
};

BonusHelmet.prototype = new Bonus();
BonusHelmet.prototype.constructor = BonusHelmet;

BonusHelmet.prototype.applyTo = function(tank)
{
    tank.armoredTimer = 10 * 1000/30; // 30ms step
};

BonusLive = function BonusLive(x, y)
{
    Bonus.apply(this, arguments);
    this.setImage('img/live.png');
};

BonusLive.prototype = new Bonus();
BonusLive.prototype.constructor = BonusLive;

BonusLive.prototype.applyTo = function(tank)
{
    tank.user.lives++;
    tank.user.emit('change', {type: 'change', object: tank.user});
};

BonusTimer = function BonusTimer(x, y)
{
    Bonus.apply(this, arguments);
    this.setImage('img/timer.png');
};

BonusTimer.prototype = new Bonus();
BonusTimer.prototype.constructor = BonusTimer;

BonusTimer.prototype.applyTo = function(tank)
{
    tank.field.timer = 10 * 1000/30; // 30ms step
};
