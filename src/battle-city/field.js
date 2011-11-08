Field = function Field(width, height)
{
    this.width      = width;
    this.height     = height;
    this.objects    = null;
    this.step       = 1;
    this.clear();
    this.setMaxListeners(100); // @todo
};

Eventable(Field.prototype);
if (typeof Loggable == 'function') {
    Loggable(Field.prototype);
}

Field.autoIncrement = 1; // todo eliminate?

Field.prototype.clear = function()
{
    this.objects = new MapArrayed(); // todo MapTree
};

Field.prototype.add = function(object)
{
    if (typeof object.id == 'undefined') {
        object.id = Field.autoIncrement++;
    }
    object.field = this;
    this.objects.add(object);
    this.emit('add', {type: 'add', object: object});
};

Field.prototype.remove = function(object)
{
    if (this.objects.remove(object)) {
        this.emit('remove', {type: 'remove', object: object});
    }
    if (isClient() && object instanceof Bullet) {
        var anim = new BulletHitAnimation(this.step, object.finalX, object.finalY);
        anim.id = object.id;
        this.add(anim);
    }
    if (isClient() && object instanceof Tank) {
        var anim = new TankHitAnimation(this.step, object.x, object.y);
        anim.id = object.id;
        this.add(anim);
    }
};

Field.prototype.move = function(item, newX, newY)
{
    return this.objects.move(item, newX, newY);
};

Field.prototype.intersect = function(object)
{
    return this.objects.intersects(object);
};

Field.prototype.terrain = function(map)
{
    // todo move from this function
    for (var i = 0 ; i < 3; i++) {
        this.game.botStack.add(new HeavyTankBot(0, 0, true));
        this.game.botStack.add(new FastBulletTankBot(0, 0, true));
        this.game.botStack.add(new FastTankBot(0, 0, true));
        this.game.botStack.add(new TankBot(0, 0, true));
    }

    this.add(new Delimiter(           - 20, this.height /  2,             20, this.height / 2));
    this.add(new Delimiter(this.width + 20, this.height /  2,             20, this.height / 2));
    this.add(new Delimiter(this.width /  2,             - 20, this.width / 2,              20));
    this.add(new Delimiter(this.width /  2, this.height + 20, this.width / 2,              20));
    this.add(new      Base(this.width /  2, this.height - 16));

    for (var y = 0 ; y < 26 ; y++) {
        for (var x = 0 ; x < 26 ; x++) {
            switch (map[y][x]) {
            case 1:
                this.add(new Wall(x*16+ 4, y*16+ 4));
                this.add(new Wall(x*16+12, y*16+ 4));
                this.add(new Wall(x*16+ 4, y*16+12));
                this.add(new Wall(x*16+12, y*16+12));
                break;
            case 2:
                this.add(new SteelWall(x*16+8, y*16+8));
                break;
            case 3:
                this.add(new Trees(x*16+8, y*16+8));
                break;
            case 4:
                this.add(new Water(x*16+8, y*16+8));
                break;
            case 5:
                this.add(new Ice(x*16+8, y*16+8));
                break;
            }
        }
    }

    this.add(new BonusShovel(10*16, 20*16));
};

Field.prototype.canPutTank = function(x, y)
{
    var res = true;
    this.intersect({x: x, y: y, hw: 16, hh: 16}).forEach(function(item){
        if (!(item instanceof Bonus)) {
            res = false;
        }
    });
    return res;
};

// client methods
Field.prototype.updateWith = function(data)
{
    for (var i in data) {
        var event = data[i];
        switch (event.type) {
        case 'remove':
            if (obj = this.objects.get(event.data.id)) {
                obj.unserialize(event.data); // for bullets finalX and finalY
                this.remove(obj);
            }
            break;
            case 'add':
            case 'change':
                var obj = this.objects.get(event.data.id);
                if (obj) {
                    obj.unserialize(event.data);
                } else {
                    obj = new (window[event.data.type])();
                    obj.unserialize(event.data);
                    this.add(obj);
                }
                break;
        }
    }
};

Field.prototype.animateStep = function()
{
//    this.animateQueue || (this.animateQueue = []);
    this.objects.forEach(function(item) {
        if (item instanceof Water) { // todo move to Water
            if (this.step % 10 == 0) {
                if (this.step % 20 >= 10) {
                    item.setImage('img/water2.png');
                } else {
                    item.setImage('img/water1.png');
                }
            }
        }
        item.animateStep && item.animateStep(this.step);
    }, this);
    this.step++;

    field.draw();
//    console.log('animate step');
};
