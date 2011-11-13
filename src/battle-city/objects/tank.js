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
    this.img = [];
    this.setDirectionImage();
    this.maxBullets = 1;
    this.bulletPower = 1;
    this.bullets = new Array();
    // can move to current direction?
    this.stuck = false;
    this.lives = 1;
    this.bonus = false;
    this.clan = 0; // users

    this.armoredTimer = 10 * 1000/30; // 30ms step
    this.trackStep = 1; // 1 or 2

    this.birthTimer = 1 * 1000/30; // 30ms step

    this.onIce = false;
    this.glidingTimer = 0;
};

Tank.prototype = new AbstractGameObject();
Tank.prototype.constructor = Tank;
Tank.prototype.imgBase = 'img/tank1';
Tank.prototype.speed = 2; // default speed
Tank.prototype.bulletSpeed = 5; // default speed

Eventable(Tank.prototype);

Tank.prototype.onAddToField = function()
{
    var bullets = this.bullets;
    // todo why every hit?
    this.field.on('remove', function(event) {
        for (var i in bullets) {
            if (bullets[i] == event.object) {
                bullets.splice(i, 1);
            }
        }
    });
};

Tank.prototype.fire = function()
{
    if (this.bullets.length < this.maxBullets) {
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
    if ((this.birthTimer > 0)) {
        this.birthTimer--;
        this.emit('change', {type: 'change', object: this});
        return;
    }
    if (this instanceof TankBot && paused) return;

    if (this.armoredTimer > 0) this.armoredTimer--;
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

Tank.prototype.serialize = function()
{
    return {
        type: this.constructor.name,
        id: this.id,
        x: this.x,
        y: this.y,
        z: this.z,
        speedX: this.speedX,
        speedY: this.speedY,
        bonus: this.bonus,
        armoredTimer: this.armoredTimer,
        birthTimer: this.birthTimer
    };
};

// function for override for different sprites
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
    this.img[0] = (this.imgBase + '-' + dir + '-s' + this.trackStep +
            (this.blink ? '-blink' : '') + '.png');
};

Tank.prototype.unserialize = function(data)
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
    this.setSpeedX(data.speedX);
    this.setSpeedY(data.speedY);
    this.armoredTimer = data.armoredTimer;
    this.birthTimer = data.birthTimer;
    this.bonus = data.bonus;
};

Tank.prototype.animateStep = function(step)
{
    if (this.birthTimer > 0) {
        this.img[0] = 'img/birth' + ((step % 6) > 3 ? 1 : 2) + '.png';
    } else {
        if (this.moveOn) {
            this.trackStep = step % 2 + 1;
        }
        if (this.bonus) {
            this.blink = (step % 10) > 5;
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
    if (bullet === undefined) {
        this.lives = 0;
        this.field.remove(this);
    } else if (this.clan != bullet.clan) {
        // do not hit your confederates (or yourself)
        if (--this.lives <= 0) {
            if (bullet.tank.user) {
                bullet.tank.user.addReward(this.reward);
            }

            if (this.user) {
                this.user.hit();
            } else {
                this.field.remove(this);
            }
        }
    }
    return true;
};

Tank.prototype.resetPosition = function()
{
    this.maxBullets = 1;
    this.bulletPower = 1;
    if (this.field) {
        this.field.setXY(this, this.initialPosition.x, this.initialPosition.y);
    }
    this.armoredTimer = 10 * 1000/30; // 30ms step
    this.birthTimer = 1 * 1000/30; // 30ms step
    this.emit('change', {type: 'change', object: this});
};
