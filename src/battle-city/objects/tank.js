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
    this.speed = 2;
    this.speedX = 0;
    this.speedY = -this.speed;
    this.img = new Image();
    this.img.src = 'img/tank-up.png';
    this.maxBullets = 1;
    this.bulletPower = 1;
    this.bullets = new Array();
    // can move to current direction?
    this.stuck = false;
    this.clan = 0; // users
};

Eventable(Tank.prototype);

Tank.prototype.fire = function()
{
    var bullets = this.bullets;
    if (bullets.length < this.maxBullets) {
        var bullet = new Bullet();
        bullet.tank = this;
        bullet.clan = this.clan;
        bullet.speedX = this.speedX * 4;
        bullet.speedY = this.speedY * 4;
        bullet.x = this.x + (this.speedX != 0 ? (this.hw+1-Math.abs(bullet.speedX)) * this.speedX / Math.abs(this.speedX) : 0);
        bullet.y = this.y + (this.speedY != 0 ? (this.hh+1-Math.abs(bullet.speedY)) * this.speedY / Math.abs(this.speedY) : 0);
        bullet.power = this.bulletPower;

        bullets.push(bullet);
        this.field.addObject(bullet);
        this.field.on('removeObject', function(event) {
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
  if (this.moveOn) {
      var x = this.x;
      var y = this.y;
      this.stuck = false;
      this.x += this.speedX;
      this.y += this.speedY;
      var intersect = this.field.intersect(this);
      if (intersect.length > 0) {
          for (var i in intersect) {
              switch (intersect[i].constructor) {
              case Trees:
                  break;
              case Bonus:
                  this.onBonus(intersect[i]);
                  break;
              default:
                  this.x = x;
                  this.y = y;
                  this.stuck = true;
              }
          }
      }
      this.emit('change', {type: 'change', object: this});
  }
};

Tank.prototype.onBonus = function(bonus)
{
    if (this.maxBullets == 1) {
        this.maxBullets = 2;
    } else if (this.bulletPower == 1) {
        this.bulletPower = 2;
    }
    this.field.removeObject(bonus);
};

Tank.prototype.serialize = function()
{
    return {
        type: 'Tank',
        id: this.id,
        x: this.x,
        y: this.y,
        z: this.z,
        speedX: this.speedX,
        speedY: this.speedY
    };
};

Tank.prototype.unserialize = function(data)
{
    this.id = data.id;
    this.x = data.x;
    this.y = data.y;
    this.z = data.z;
    this.speedX = data.speedX;
    this.speedY = data.speedY;

    if (this.speedX == 0 && this.speedY  > 0) {
        this.img.src = 'img/tank-down.png';
    }
    if (this.speedX == 0 && this.speedY  < 0) {
        this.img.src = 'img/tank-up.png';
    }
    if (this.speedX  > 0 && this.speedY == 0) {
        this.img.src = 'img/tank-right.png';
    }
    if (this.speedX  < 0 && this.speedY == 0) {
        this.img.src = 'img/tank-left.png';
    }
};

Tank.prototype.startMove = function(direction)
{
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
};

Tank.prototype.stopMove = function()
{
    this.moveOn = false;
};

Tank.prototype.hit = function(bullet)
{
    // do not hit your confederates (or yourself)
    if (this.clan != bullet.clan) {
        if (bullet.tank.user) {
            bullet.tank.user.addReward(this.reward);
        }

        if (this.user) {
            this.user.hit();
        } else {
            this.field.removeObject(this);
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
