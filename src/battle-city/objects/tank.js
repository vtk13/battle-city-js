/**
 * drawable
 * coordinates
 */

Tank = function Tank(x, y)
{
    AbstractGameObject.call(this, 16, 16);
    this.initialPosition = {
        x: x,
        y: y
    };
    this.x = x;
    this.y = y;
    this.z = 1;
    this.moveOn = 0;
    this.setSpeedX(0);
    this.setSpeedY(-this.speed);
    this.setDirectionImage();
    this.maxBullets = 1;
    this.bulletPower = 1;
    this.bullets = new Array();
    // can move to current direction?
    this.stuck = false;
    this.lives = 1;
    this.bonus = false;
    this.clan = null;

    this.armoredTimer = Tank.defaultArmoredTimer; // 30ms step
    this.trackStep = 1; // 1 or 2

    this.birthTimer = 1 * 1000/30; // 30ms step
    this.fireTimer = 0;

    this.onIce = false;
    this.glidingTimer = 0;
    this.blink = false;
};

Tank.defaultArmoredTimer = 10 * 1000/30; // 30ms step

Tank.prototype = new AbstractGameObject();
Tank.prototype.constructor = Tank;
Tank.prototype.imgBase = 'img/tank';
Tank.prototype.reward = 100;
Tank.prototype.speed = 2; // default speed
Tank.prototype.bulletSpeed = 5; // default speed

Eventable(Tank.prototype);

Tank.prototype.onAddToField = function()
{
    var tank = this;
    this.field.on('remove', function(object) {
        for (var i in tank.bullets) {
            if (tank.bullets[i] == object) {
                tank.bullets.splice(i, 1);
            }
        }
    });
};

Tank.prototype.fire = function()
{
    if (this.birthTimer <= 0 && this.bullets.length < this.maxBullets &&
            !(this.bullets.length > 0 && this.fireTimer > 0)) {
        if (this.bullets.length > 0) { // to not second fire too fast
            this.fireTimer = 0.5 * 1000/30; // 30ms step
        }
        var bullet = new Bullet();
        bullet.tank = this;
        bullet.clan = this.clan;
        bullet.setSpeedX(vector(this.speedX) * this.bulletSpeed);
        bullet.setSpeedY(vector(this.speedY) * this.bulletSpeed);
        // before adding to field (may set x, y directly)
        bullet.x = this.x + (this.hw - 2) * vector(this.speedX);
        bullet.y = this.y + (this.hh - 2) * vector(this.speedY);
        bullet.power = this.bulletPower;

        this.bullets.push(bullet);
        this.field.add(bullet);
    }
};

Tank.prototype.step = function(paused)
{
    if (this.fireTimer > 0) this.fireTimer--;
    if ((this.birthTimer > 0)) {
        this.birthTimer--;
        this.emit('change', {type: 'change', object: this});
        return;
    }

    if (this.armoredTimer > 0) {
        this.armoredTimer--;
        if (this.armoredTimer <= 0) {
            this.emit('change', {type: 'change', object: this});
        }
    }
    if (paused) return;

    var onIce = false;
    if (this.moveOn || this.glidingTimer > 0) {
        // todo field.move()?
        var x = this.x;
        var y = this.y;
        this.stuck = false;
        if (this.field) {
            this.field.setXY(this, this.x + this.speedX, this.y + this.speedY);
        }
        var intersect = this.field.intersect(this);
        if (intersect.length > 0) {
            for (var i in intersect) {
                switch (true) {
                case intersect[i] instanceof Bonus:
                    this.onBonus(intersect[i]);
                    break;
                case intersect[i] instanceof Ice:
                    onIce = true;
                    // no break! before default!
                default:
                    if (intersect[i].z == this.z) {
                        if (this.field) {
                            this.field.setXY(this, x, y);
                        }
                        this.stuck = true;
                        this.glidingTimer = 0;
                    }
                }
            }
        }
        this.onIce = onIce;
        if (this.glidingTimer > 0) {
             onIce && this.glidingTimer--;
            !onIce && (this.glidingTimer = 0);
        }
        this.emit('change', {type: 'change', object: this});
    }
};

Tank.prototype.onBonus = function(bonus)
{
    bonus.applyTo(this);
    this.field.remove(bonus);
};

//function for override for different sprites
Tank.prototype.setDirectionImage = function()
{
 var dir = 'up';
 if (this.speedY  > 0) {
     dir = 'down';
 } else if (this.speedY  < 0) {
     dir = 'up';
 } else if (this.speedX  > 0) {
     dir = 'right';
 } else if (this.speedX  < 0) {
     dir = 'left';
 }
 this.img[0] = (((this.imgBase == 'img/tank') ? this.imgBase + this.clanN : this.imgBase) // todo clanN hack
         + '-' + dir + '-s' + this.trackStep + (this.blink ? '-blink' : '') + '.png');
};

Tank.prototype.serialize = function()
{
    return [
        battleCityTypesSerialize[this.constructor.name], // 0
        this.id, // 1
        this.x, // 2
        this.y, // 3
        this.speedX, // 4
        this.speedY, // 5
        this.bonus, // 6
        Math.round(this.armoredTimer), // 7
        Math.round(this.birthTimer), // 8
        this.clan.n
    ];
};

Tank.prototype.unserialize = function(data)
{
    this.id = data[1];
    if (this.field) {
        this.field.setXY(this, data[2], data[3]);
    } else {
        // first unserialize, before adding to field -> may set x and y directly
        this.x = data[2];
        this.y = data[3];
    }
    this.setSpeedX(data[4]);
    this.setSpeedY(data[5]);
    this.bonus = data[6];
    this.armoredTimer = data[7];
    this.birthTimer = data[8];
    this.clanN = data[9];
};

Tank.prototype.animateStep = function(step)
{
    if (this.birthTimer > 0) {
        this.img[0] = 'img/birth' + ((step % 6) > 3 ? 1 : 2) + '.png';
        delete this.img[1];
    } else {
        if (this.moveOn) {
            this.trackStep = step % 2 + 1;
        }
        if (this.bonus) {
            this.blink = (step % 10) > 5;
        } else if(this.blink) {
            this.blink = false;
        }
        this.setDirectionImage();
        if (this.armoredTimer > 0) {
            this.img[1] = step % 2 ? 'img/armored1.png' : 'img/armored2.png';
        } else {
            delete this.img[1];
        }
    }
};

Tank.prototype.startMove = function(direction)
{
    if (this.direction != direction) {
        this.direction = direction;
        this.moveOn = true;
        // emulate move back tank for 1 pixel
        // doto this may be a bug, if tank just change direction to opposite
        var vx = this.speedX > 0 ? 1 : -1;
        var vy = this.speedY > 0 ? 1 : -1;
        var newX, newY;
        switch (direction) {
            case 'up':
                this.setSpeedX(0);
                this.setSpeedY(-this.speed);
                newX = this.x + ((this.x % 16 > 8 + vx) ? 16 - this.x % 16 : - this.x % 16);
                newY = this.y;
                break;
            case 'right':
                this.setSpeedX(this.speed);
                this.setSpeedY(0);
                newX = this.x;
                newY = this.y + ((this.y % 16 > 8 + vy) ? 16 - this.y % 16 : - this.y % 16);
                break;
            case 'down':
                this.setSpeedX(0);
                this.setSpeedY(this.speed);
                newX = this.x + ((this.x % 16 > 8 + vx) ? 16 - this.x % 16 : - this.x % 16);
                newY = this.y;
                break;
            case 'left':
                this.setSpeedX(-this.speed);
                this.setSpeedY(0);
                newX = this.x;
                newY = this.y + ((this.y % 16 > 8 + vy) ? 16 - this.y % 16 : - this.y % 16);
                break;
        }
        this.field.setXY(this, newX, newY);
        this.emit('change', {type: 'change', object: this});
    }
};

Tank.prototype.stopMove = function()
{
    this.direction = null;
    this.moveOn = false;
    if (this.onIce) {
        this.glidingTimer = 1000/30; // 30ms step
    }
};

/**
 * Bullet may be undefined (see BonusGrenade)
 */
Tank.prototype.hit = function(bullet)
{
    if (this.armoredTimer > 0) {
        return true;
    }
    // do not hit your confederates (or yourself)
    if (!bullet || this.clan != bullet.clan) {
        if (bullet) {
            this.lives--;
        } else {
            this.lives = 0;
        }
        if (this.lives <= 0) {
            if (bullet && bullet.tank.user) {
                bullet.tank.user.addReward(this.reward);
            }

            if (this.user) {
                this.user.hit();
            } else {
                this.field.remove(this);
            }
        }
        // this.clan.enemiesClan.base means enemies is people, not bots
        if (bullet && (this.bonus || (this.user && this.clan.enemiesClan.base))) {
            this.bonus = false;
            var bonuses = [BonusStar, BonusGrenade, BonusShovel, BonusHelmet, BonusLive, BonusTimer];
            this.field.add(new (bonuses[Math.floor(Math.random()*(bonuses.length-0.0001))])(
                Math.round((Math.random() * (this.field.width  / 16 - 2))) * 16 + 16,
                Math.round((Math.random() * (this.field.height / 16 - 2))) * 16 + 16
            ));
        }
    }
    return true;
};

Tank.prototype.resetPosition = function()
{
    this.maxBullets = 1;
    this.bulletPower = 1;
    this.moveOn = 0;
    this.setSpeedX(0);
    this.setSpeedY(-this.speed);
    this.bullets = [];
    this.armoredTimer = this.clan ? this.clan.defaultArmoredTimer : Tank.defaultArmoredTimer;
    this.birthTimer = 1 * 1000/30; // 30ms step
    if (this.field) {
        this.field.setXY(this, this.initialPosition.x, this.initialPosition.y);
    }
    this.emit('change', {type: 'change', object: this});
};
