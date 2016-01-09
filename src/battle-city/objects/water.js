var AbstractGameObject = require('src/engine/objects/abstract.js');

function Water(x, y)
{
    AbstractGameObject.call(this, 8, 8);
    this.x = x;
    this.y = y;
    this.z = 1;
    this.img[0] = 'img/water1.png';
}

Water.prototype = Object.create(AbstractGameObject.prototype);
Water.prototype.constructor = Water;

Water.prototype.hit = function(bullet)
{
    return false;
};

Water.prototype.animateStep = function(step)
{
    if (step % 10 == 0) {
        if (step % 20 >= 10) {
            this.img[0] = 'img/water2.png';
        } else {
            this.img[0] = 'img/water1.png';
        }
    }
};

module.exports = Water;
