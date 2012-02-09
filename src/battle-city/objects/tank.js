define(['src/common/func.js',
        'src/battle-city/objects/abstract.js',
        'src/common/event.js',
        'src/battle-city/objects/bonus.js',
        'src/battle-city/objects/ice.js',
        'src/battle-city/objects/bullet.js'], function(func, AbstractGameObject,
                Eventable, bonus, Ice, Bullet) {
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
     *  - отрисовка (setDirectionImage(), imgBase, clanN, trackStep, blink)
     *  - пуле устанавливаются координаты напрямую, а для этого надо знать,
     *          что можно задавать x и y напрямую, только до добавления объекта
     *          в map_tiled (можно переделать map_tiled чтобы он слушал gameBus,
     *          а объекты просто кидали событие move).
     *  - distanceLeft и this.emit('task-done') - знание о том что vm на клиенте
     *          ждет этого события, чтобы продолжить выполнять код (можно выделить
     *          в tankController).
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
     *  - о виртуальной машине на клиенте (this.emit('task-done'))
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
        this.distanceLeft = null;
        this.setSpeedX(0);
        this.setSpeedY(-this.speed);
        this.direction = null;

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
        var self = this;
        this.field.on('remove', function(object) {
            for (var i in self.bullets) {
                if (self.bullets[i] == object) {
                    self.bullets.splice(i, 1);
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
            bullet.setSpeedX(func.vector(this.speedX) * this.bulletSpeed);
            bullet.setSpeedY(func.vector(this.speedY) * this.bulletSpeed);
            // before adding to field (may set x, y directly)
            bullet.x = this.x + (this.hw - 2) * func.vector(this.speedX);
            bullet.y = this.y + (this.hh - 2) * func.vector(this.speedY);
            bullet.power = this.bulletPower;

            this.bullets.push(bullet);
            this.field.add(bullet);
        }
        this.emit('task-done');
    };

    Tank.prototype.step = function(paused)
    {
        if (this.fireTimer > 0) this.fireTimer--;
        if ((this.birthTimer > 0)) {
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
        if (paused) return;

        var onIce = false;
        if (this.moveOn || this.glidingTimer > 0) {
            // todo field.move()?
            var sx = this.distanceLeft && this.distanceLeft < this.speedX ? func.vector(this.speedX) * this.distanceLeft : this.speedX;
            var sy = this.distanceLeft && this.distanceLeft < this.speedY ? func.vector(this.speedY) * this.distanceLeft : this.speedY;
            this.stuck = false;
            var intersect = this.field.intersect(this, this.x + sx, this.y + sy);
            if (intersect.length > 0) {
                for (var i in intersect) {
                    switch (true) {
                    case intersect[i] instanceof bonus.Bonus:
                        this.onBonus(intersect[i]);
                        break;
                    case intersect[i] instanceof Ice:
                        onIce = true;
                        // no break! before default!
                    default:
                        // power === undefined is a hack for fast bullet detection
                        if (intersect[i].z == this.z && intersect[i].power === undefined) {
                            this.stuck = true;
                            this.glidingTimer = 0;
                        }
                    }
                }
            }
            if (!this.stuck) {
                this.field.setXY(this, this.x + sx, this.y + sy);
                if (this.distanceLeft) {
                    this.distanceLeft -= Math.abs(sx + sy); // sx == 0 || sy == 0
                    if (this.distanceLeft == 0) {
                        this.emit('task-done');
                        this.distanceLeft = null;
                        this.moveOn = false;
                    }
                }
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
     this.img[0] = (((this.imgBase == 'img/tank') ? this.imgBase + this.clanN : this.imgBase) // todo clanN hack
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
     * @return bool
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
                    this.emit('task-done', 'Unknown direction "' + direction + '"');
                    throw new Error('Unknown direction "' + direction + '"');
            }
            var intersects = this.field.intersect(this, newX1, newY1);
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
                var intersects = this.field.intersect(this, newX2, newY2);
                for (var i in intersects) {
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
                };
            }
        }
        this.emit('task-done');
        return canTurn;
    };

    Tank.prototype.move = function(distance)
    {
        this.distanceLeft = distance;
        this.moveOn = true;
    };

    Tank.prototype.startMove = function()
    {
        this.distanceLeft = null;
        this.moveOn = true;
    };

    Tank.prototype.stopMove = function()
    {
        this.distanceLeft = null;
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
            if (bullet && (this.bonus || (this.user && !this.clan.enemiesClan.isBots()))) {
                this.bonus = false;
                var bonuses = [bonus.BonusStar, bonus.BonusGrenade, bonus.BonusShovel,
                               bonus.BonusHelmet, bonus.BonusLive, bonus.BonusTimer];
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
        this.distanceLeft = null;
        this.direction = null;
        this.moveOn = 0;
        this.setSpeedX(0);
        this.setSpeedY(-this.speed);
        this.bullets = [];
        this.armoredTimer = this.clan ? this.clan.defaultArmoredTimer : Tank.defaultArmoredTimer;
        this.birthTimer = 1 * 1000/30; // 30ms step
        if (this.field) {
            this.field.setXY(this, this.initialPosition.x, this.initialPosition.y);
        }
        this.emit('change');
    };

    return Tank;
});