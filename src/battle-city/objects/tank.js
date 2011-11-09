/**
 * drawable
 * coordinates
 */

Tank = function Tank(x, y)
{
    this.initialPosition = {
        x: x,
        y: y
    };
    this.x = x;
    this.y = y;
    this.z = 1;
    this.hw = 16; // half width
    this.hh = 16; // half height
    this.moveOn = 0;
    this.speedX = 0;
    this.speedY = -this.speed;
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

    this.onIce = false;
    this.glidingTimer = 0;
};

Tank.prototype = new AbstractGameObject();
Tank.prototype.constructor = Tank;
Tank.prototype.imgBase = 'img/tank1';
Tank.prototype.speed = 2; // default speed
Tank.prototype.bulletSpeed = 5; // default speed

Eventable(Tank.prototype);

Tank.prototype.fire = function()
{
    var bullets = this.bullets;
    if (bullets.length < this.maxBullets) {
        var bullet = new Bullet();
        bullet.tank = this;
        bullet.clan = this.clan;
        bullet.speedX = vector(this.speedX) * this.bulletSpeed;
        bullet.speedY = vector(this.speedY) * this.bulletSpeed;
        bullet.x = this.x + (this.hw+bullet.boundX()-Math.abs(bullet.speedX)) * vector(this.speedX);
        bullet.y = this.y + (this.hh+bullet.boundY()-Math.abs(bullet.speedY)) * vector(this.speedY);
        bullet.power = this.bulletPower;

        bullets.push(bullet);
        this.field.add(bullet);
        this.field.on('remove', function(event) {
            for (var i in bullets) {
                if (bullets[i] == event.object) {
                    bullets.splice(i, 1);
                }
            }
        });
    }
};

Tank.prototype.step = function()
{
    this.armoredTimer > 0 && this.armoredTimer--;
    var onIce = false;
    if (this.moveOn || this.glidingTimer > 0) {
        var x = this.x;
        var y = this.y;
        this.stuck = false;
        this.x += this.speedX;
        this.y += this.speedY;
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
                        this.x = x;
                        this.y = y;
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
        armoredTimer: this.armoredTimer
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
    this.setImage(this.imgBase + '-' + dir + '-s' + this.trackStep +
            (this.blink ? '-blink' : '') + '.png');
};

Tank.prototype.unserialize = function(data)
{
    this.id = data.id;
    this.x = data.x;
    this.y = data.y;
    this.z = data.z;
    this.speedX = data.speedX;
    this.speedY = data.speedY;
    this.armoredTimer = data.armoredTimer;
    this.bonus = data.bonus;

    this.setDirectionImage();
};

Tank.prototype.animateStep = function(step)
{
    if (this.armoredTimer > 0) {
        this.img[2] = step % 2 ? 'img/armored1.png' : 'img/armored2.png';
    } else {
        delete this.img[2];
    }
    if (this.moveOn) {
        this.trackStep = step % 2 + 1;
    }
    if (this.bonus) {
        this.blink = (step % 10) > 5;
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
        switch (direction) {
            case 'up':
                this.speedX = 0;
                this.speedY = -this.speed;
                this.x += (this.x % 16 > 8 + vx) ? 16 - this.x % 16 : - this.x % 16;
                break;
            case 'right':
                this.speedX = this.speed;
                this.speedY = 0;
                this.y += (this.y % 16 > 8 + vy) ? 16 - this.y % 16 : - this.y % 16;
                break;
            case 'down':
                this.speedX = 0;
                this.speedY = this.speed;
                this.x += (this.x % 16 > 8 + vx) ? 16 - this.x % 16 : - this.x % 16;
                break;
            case 'left':
                this.speedX = -this.speed;
                this.speedY = 0;
                this.y += (this.y % 16 > 8 + vy) ? 16 - this.y % 16 : - this.y % 16;
                break;
        }
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
    this.x = this.initialPosition.x;
    this.y = this.initialPosition.y;
    this.emit('change', {type: 'change', object: this});
};
