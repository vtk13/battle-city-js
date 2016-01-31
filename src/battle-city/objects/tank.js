var func = require('src/common/func.js');
var AbstractGameObject = require('src/engine/objects/abstract.js');
var bonus = require('src/battle-city/objects/bonus.js');
var Ice = require('src/battle-city/objects/ice.js');
var Bullet = require('src/battle-city/objects/bullet.js');
var Odb = require('src/engine/store/odb.js');

/**
 * drawable
 * coordinates
 *
 * interface:
 *  fire()
 *  turn(direction)
 *  startMove()
 *  stopMove()
 *
 * В этом классе перемешанны:
 *  - сама сущность
 *  - отрисовка (animateStep(), imgBase, colorCode, trackStep, blink)
 *  - не понятно куда пристроить обработку бонусов, толи this.onBonus толи в
 *          bonus.onIntersect. А может вообще в отдельный класс?
 *  - сериализация
 *
 * Этот класс знает о:
 *  - о своих пулях (bullets)
 *  - об игровом поле (field)
 *  - бонусах (onBonus)
 *  - о льде (Ice)
 *  - о кланах (clan)
 *  - о спрайтах для отрисовки
 *  - serializeTypeMatches
 *  - о пользователях (bullet.tank.user.addReward(this.reward))
 *
 */

function Tank(x, y)
{
    AbstractGameObject.call(this, 16, 16);
    this.initialPosition = {
        x: x,
        y: y
    };
    this.x = x;
    this.y = y;
    this.z = 1;

    this.moveOn = 0; // flag used in Tank.step()
    this.setSpeedX(0);
    this.setSpeedY(-this.speed);
    this.direction = null;

    this.maxBullets = 1;
    this.bulletPower = 1;
    this.bullets = [];
    // can move to current direction?
    this.stuck = false;
    this.lives = 1;
    this.bonus = false; // бонусный танк, за убийство выпадает бонус
    this.clan = null;
    this.colorCode = 0;

    this.armoredTimer = Tank.defaultArmoredTimer; // 30ms step
    this.trackStep = 1; // 1 or 2

    this.birthTimer = 1000 / 30; // 30ms step
    this.fireTimer = 0;
    this.pauseTimer = 0;

    this.onIce = false;
    this.glidingTimer = 0;
    this.blink = false;
}

Tank.defaultArmoredTimer = 10 * 1000 / 30; // 30ms step

Tank.prototype = Object.create(AbstractGameObject.prototype);
Tank.prototype.constructor = Tank;

Tank.prototype.imgBase = 'img/tank';
Tank.prototype.reward = 100;
Tank.prototype.speed = 2; // default speed
Tank.prototype.bulletSpeed = 5; // default speed

Tank.prototype.fire = function()
{
    if (
        this.birthTimer <= 0 &&
        this.bullets.length < this.maxBullets &&
        !(this.bullets.length > 0 && this.fireTimer > 0)
    ) {
        this.fireTimer = 0.5 * 1000/30; // 30ms step

        var bullet = new Bullet(

        );
        bullet.tank = this;
        bullet.clan = this.clan;
        bullet.setSpeedX(func.vector(this.speedX) * this.bulletSpeed);
        bullet.setSpeedY(func.vector(this.speedY) * this.bulletSpeed);
        // before adding to field (may set x, y directly)
        bullet.x = this.x + (this.hw - 2) * func.vector(this.speedX);
        bullet.y = this.y + (this.hh - 2) * func.vector(this.speedY);
        bullet.power = this.bulletPower;

        this.bullets.push(bullet);
        this.field.add(bullet);

        bullet.once('hit', () => {
            var index = this.bullets.indexOf(bullet);
            if (index >= 0) {
                this.bullets.splice(index, 1);
            }
        });
    }
};

Tank.prototype.step = function()
{
    this.pauseTimer > 0 && this.pauseTimer--;

    this.fireTimer > 0 && this.fireTimer--;

    if (this.birthTimer > 0) {
        this.birthTimer--;
        this.emit('change');
        return;
    }

    if (this.armoredTimer > 0) {
        this.armoredTimer--;
        if (this.armoredTimer <= 0) {
            this.emit('change');
        }
    }

    if (this.pauseTimer > 0) {
        return;
    }

    var onIce = false;
    if (this.moveOn || this.glidingTimer > 0) {
        this.stuck = false;
        var intersect = this.field.intersects(this, this.x + this.speedX, this.y + this.speedY);
        for (var i in intersect) {
            switch (true) {
                case intersect[i] instanceof bonus.Bonus:
                    this.onBonus(intersect[i]);
                    break;
                case intersect[i] instanceof Ice:
                    onIce = true;
                    // noinspection FallThroughInSwitchStatementJS
                default:
                    // power === undefined is a hack for fast bullet detection
                    if (intersect[i].z == this.z && intersect[i].power === undefined) {
                        this.stuck = true;
                        this.glidingTimer = 0;
                    }
            }
        }
        if (!this.stuck) {
            this.field.setXY(this, this.x + this.speedX, this.y + this.speedY);
        }
        this.onIce = onIce;
        if (this.glidingTimer > 0) {
            if (onIce) {
                this.glidingTimer--;
            } else {
                this.glidingTimer = 0;
            }
        }
        this.emit('change');
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
    this.img[0] = (((this.imgBase == 'img/tank') ? this.imgBase + this.colorCode : this.imgBase)
         + '-' + dir + '-s' + this.trackStep + (this.blink ? '-blink' : '') + '.png');
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

/**
 * There are circumstances when turning is impossible, so return bool
 *
 * @todo too long function
 * @param direction
 * @return boolean
 */
Tank.prototype.turn = function(direction)
{
    var canTurn = true;
    if (direction == 'right') {
        switch (true) {
        case this.speedX > 0:
            direction = 'south';
            break;
        case this.speedX < 0:
            direction = 'north';
            break;
        case this.speedY > 0:
            direction = 'west';
            break;
        case this.speedY < 0:
            direction = 'east';
            break;
        }
    }
    if (direction == 'left') {
        switch (true) {
        case this.speedX > 0:
            direction = 'north';
            break;
        case this.speedX < 0:
            direction = 'south';
            break;
        case this.speedY > 0:
            direction = 'east';
            break;
        case this.speedY < 0:
            direction = 'west';
            break;
        }
    }
    if (this.direction != direction) {
        // emulate move back tank for 1 pixel
        // doto this may be a bug, if tank just change direction to opposite
        var vx = this.speedX > 0 ? 1 : -1;
        var vy = this.speedY > 0 ? 1 : -1;
        // 1, 2 - first try turn with backward adjust, second try turn with forward adjust
        var newX1, newY1, newX2, newY2, newSpeedX, newSpeedY;
        switch (direction) {
            case 'north':
                newSpeedX = 0;
                newSpeedY = -this.speed;
                if (this.x % 16 > 8 + vx) {
                    newX1 = this.x + 16 - this.x % 16;
                    newX2 = this.x - this.x % 16;
                } else {
                    newX1 = this.x - this.x % 16;
                    newX2 = this.x + 16 - this.x % 16;
                }
                newY1 = newY2 = this.y;
                break;
            case 'east':
                newSpeedX = this.speed;
                newSpeedY = 0;
                newX1 = newX2 = this.x;
                if (this.y % 16 > 8 + vy) {
                    newY1 = this.y + 16 - this.y % 16;
                    newY2 = this.y - this.y % 16;
                } else {
                    newY1 = this.y - this.y % 16;
                    newY2 = this.y + 16 - this.y % 16;
                }
                break;
            case 'south':
                newSpeedX = 0;
                newSpeedY = this.speed;
                if (this.x % 16 > 8 + vx) {
                    newX1 = this.x + 16 - this.x % 16;
                    newX2 = this.x - this.x % 16;
                } else {
                    newX1 = this.x - this.x % 16;
                    newX2 = this.x + 16 - this.x % 16;
                }
                newY1 = newY2 = this.y;
                break;
            case 'west':
                newSpeedX = -this.speed;
                newSpeedY = 0;
                newX1 = newX2 = this.x;
                if (this.y % 16 > 8 + vy) {
                    newY1 = this.y + 16 - this.y % 16;
                    newY2 = this.y - this.y % 16;
                } else {
                    newY1 = this.y - this.y % 16;
                    newY2 = this.y + 16 - this.y % 16;
                }
                break;
            default:
                throw new Error('Unknown direction "' + direction + '"');
        }
        var intersects = this.field.intersects(this, newX1, newY1);
        for (var i in intersects) {
            if (intersects[i].z == this.z) {
                canTurn = false;
            }
        }
        if (canTurn) {
            // new place is clear, turn:
            this.field.setXY(this, newX1, newY1);
            this.setSpeedX(newSpeedX);
            this.setSpeedY(newSpeedY);
            this.direction = direction;
            this.emit('change');
        } else {
            canTurn = true;
            intersects = this.field.intersects(this, newX2, newY2);
            for (i in intersects) {
                if (intersects[i].z == this.z) {
                    canTurn = false;
                }
            }
            if (canTurn) {
                // new place is clear, turn:
                this.field.setXY(this, newX2, newY2);
                this.setSpeedX(newSpeedX);
                this.setSpeedY(newSpeedY);
                this.direction = direction;
                this.emit('change');
            }
        }
    }
    return canTurn;
};

Tank.prototype.startMove = function()
{
    this.moveOn = true;
};

Tank.prototype.stopMove = function()
{
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
    if (!bullet) {
        this.field.remove(this);
        this.emit('hit');
        return true;
    }

    if (this.armoredTimer > 0) {
        return true;
    }

    // do not hit either your confederates or yourself
    if (bullet.clan == this.clan) {
        return true;
    }

    this.lives--;
    if (this.lives <= 0) {
        // todo no bullet.tank.user now
        bullet.tank.user && bullet.tank.user.addReward(this.reward);
        this.field.remove(this);
        this.emit('hit');
    }

    // если пулей подстрелен бонусный танк или танк противника в сетевой игре
    // todo просто делать все танки бонусные в сетевой игре
    if (this.bonus || (this.user && !this.clan.enemiesClan.isBots())) {
        this.bonus = false;
        var bonuses = [
            bonus.BonusStar,
            bonus.BonusGrenade,
            bonus.BonusShovel,
            bonus.BonusHelmet,
            bonus.BonusLive,
            bonus.BonusTimer
        ];
        this.field.add(new (bonuses[Odb.instance().random(0, bonuses.length - 1)])(
            (Odb.instance().random(0, Math.floor(this.field.width  / 16 - 3))) * 16 + 16,
            (Odb.instance().random(0, Math.floor(this.field.height / 16 - 3))) * 16 + 16
        ));
    }

    return true;
};

Tank.prototype.resetPosition = function()
{
    this.direction = null;
    this.moveOn = 0;
    this.setSpeedX(0);
    this.setSpeedY(-this.speed);
    this.bullets = [];
    this.armoredTimer = this.clan ? this.clan.defaultArmoredTimer : Tank.defaultArmoredTimer;
    this.birthTimer = 1000 / 30; // 30ms step
    if (this.field) {
        this.field.setXY(this, this.initialPosition.x, this.initialPosition.y);
    }
    this.emit('change');
};

module.exports = Tank;
