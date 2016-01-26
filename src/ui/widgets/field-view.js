var $ = require('jquery');
var Bullet = require('src/battle-city/objects/bullet.js');
var Tank = require('src/battle-city/objects/tank.js');
var animation = require('src/battle-city/objects/animation.js');

function FieldView(context, client)
{
    this.field = client.currentPremade.field;
    this.context = context;
    this.message = '';
    this.c2d = $('#field', context).get(0).getContext('2d');
    this.c2d.font ="bold 25px Arial";
    this.step = 1;
    this.animateIntervalId = null;
    var self = this;

    this.field.on('remove', function(object) {
        var field = this, anim;
        if (object instanceof Bullet) {
            anim = new animation.BulletHitAnimation(self.step, object.finalX, object.finalY);
        }
        if (object instanceof Tank) { // todo hit myself without splash :(
            anim = new animation.TankHitAnimation(self.step, object.x, object.y);
        }

        if (anim) {
            anim.id = object.id;
            // there is a problem with animation objects:
            // adding their on client generate duplicated id, so with next sync from server
            // we have undefined behaviour. As workaround postpone adding animation object
            // to field to text tick, when objects itself is removed from field.
            setTimeout(function() {
               field.add(anim);
            }, 0);
        }
    });

    client.socket.on('gameover', function(event) {
        if (event.winnerClanN == 0) {
            self.message = 'Победа!';
        } else {
            self.message = 'Вы проиграли';
        }
        setTimeout(function() {
            clearInterval(self.animateIntervalId);
        }, 2000); // todo quick hack, stop simulation is delayed also in premade
    });
    client.socket.on('disconnect', function() {
        clearInterval(self.animateIntervalId);
    });
    client.socket.on('unjoined', function() {
        clearInterval(self.animateIntervalId);
    });
    client.socket.on('started', function() {
        clearInterval(self.animateIntervalId);
        self.message = '';
        if (window.location.hash != '#test') {
            self.animateIntervalId = setInterval(self.animateStep.bind(self), 50);
        }
    });
}

FieldView.prototype._animateStepItem = function(item)
{
    item.animateStep && item.animateStep(this.step);
};

FieldView.prototype.animateStep = function()
{
    this.field.traversal(FieldView.prototype._animateStepItem, this);
    this.step++;

    this.draw();
};

FieldView.prototype.drawItem = function(current)
{
    if (current.z == this.z) {
        for (var i in current.img) {
            this.c2d.drawImage(window.images[current.img[i]],
                    current.x - current.hw,
                    current.y - current.hh);
        }
    }
};

FieldView.prototype.draw = function()
{
    this.c2d.fillStyle = '#041012';
    this.c2d.fillRect(0, 0, this.field.width, this.field.height);

    for (this.z = 0 ; this.z <= 2 ; this.z++) { // this.z hack?
        this.field.traversal(this.drawItem, this);
    }

    this.c2d.fillStyle = '#fff';
    this.c2d.fillText(this.message, 100, 200);
    this.c2d.strokeStyle = '#000';
    this.c2d.strokeText(this.message, 100, 200);
};

module.exports = FieldView;
