Field = function Field(width, height)
{
    this.width      = width;
    this.height     = height;
    this.objects    = null;
    this.step       = 1;
    this.timer      = 0;
    this.clear();
    this.setMaxListeners(100); // @todo
    if (typeof Loggable == 'function') {
        Loggable(this);
    }
};

Eventable(Field.prototype);

Field.autoIncrement = 1; // todo eliminate?

Field.prototype.clear = function()
{
    this.objects = new MapTiled(this.width, this.height);
};

Field.prototype.add = function(object)
{
    if (typeof object.id == 'undefined') {
        object.id = Field.autoIncrement++;
    }
    object.field = this;
    this.objects.add(object);
    this.emit('add', {type: 'add', object: object});
    object.onAddToField && object.onAddToField();
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
    if (isClient() && object instanceof Tank) { // todo hit myself without splash ((
        var anim = new TankHitAnimation(this.step, object.x, object.y);
        anim.id = object.id;
        this.add(anim);
    }
};

Field.prototype.setXY = function(item, newX, newY)
{
    return this.objects.setXY(item, newX, newY);
};

Field.prototype.move = function(item, newX, newY)
{
    return this.objects.move(item, newX, newY);
};

/**
 *
 * @param object AbstractGameObject
 * @return
 */
Field.prototype.intersect = function(object, newX, newY, boundX, boundY)
{
    return this.objects.intersects(object, newX, newY, boundX, boundY);
};

Field.prototype.terrain = function(map, enemies)
{
    // todo move from this function
    for (var i in enemies) {
        var bonus = ['4','11','18'].indexOf(i) >= 0;
//        var bonus = true;
        switch (enemies[i]) {
            case 1:
                this.game.botStack.add(new TankBot(0, 0, bonus));
                break;
            case 2:
                this.game.botStack.add(new FastTankBot(0, 0, bonus));
                break;
            case 3:
                this.game.botStack.add(new FastBulletTankBot(0, 0, bonus));
                break;
            case 4:
                this.game.botStack.add(new HeavyTankBot(0, 0, bonus));
                break;
        }
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

//    this.add(new BonusTimer(10*16, 20*16));
};

Field.prototype.canPutTank = function(x, y)
{
    var res = true;
    this.intersect({}, x, y, 16, 16).forEach(function(item){
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

    this.draw();
//    console.log('animate step');
};
