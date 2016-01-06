define([
    'jquery',
    'src/battle-city/objects/bullet.js',
    'src/battle-city/objects/tank.js',
    'src/battle-city/objects/animation.js'
], function(
    $,
    Bullet,
    Tank,
    animation
) {
    function FieldView(context, client)
    {
        this.field = client.field;
        this.context = context;
        this.c2d = $('#field', context).get(0).getContext('2d');
        this.c2d.font ="bold 25px Arial";
        this.step = 1;
        this.animateIntervalId = null;
        var self = this;

        this.field.on('remove', function(object) {
            var anim;
            if (object instanceof Bullet) {
                anim = new animation.BulletHitAnimation(self.step, object.finalX, object.finalY);
                // FIXME there are problems with animation objects:
                // adding their on client generate duplicated id, so with next sync from server
                // we have undefined behaviour
                self.field.add(anim);
            }
            if (object instanceof Tank) { // todo hit myself without splash :(
                anim = new animation.TankHitAnimation(self.step, object.x, object.y);
                self.field.add(anim);
            }
        });

        window.clientServerMessageBus.on('gameover', function(event) {
            clearInterval(self.animateIntervalId);
            if (event.winnerClan == client.currentUser.clan) {
                self.message('Победа!');
            } else {
                self.message('Вы проиграли');
            }
        });
        window.clientServerMessageBus.on('disconnect', function() {
            clearInterval(self.animateIntervalId);
        });
        window.clientServerMessageBus.on('unjoined', function(){
            clearInterval(self.animateIntervalId);
        });
        window.clientServerMessageBus.on('started', function(){
            clearInterval(self.animateIntervalId);
            if (window.location.hash != '#test') {
                self.animateIntervalId =
                    setInterval(self.animateStep.bind(self), 50);
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
    };

    FieldView.prototype.message = function(message)
    {
        this.c2d.fillStyle = '#fff';
        this.c2d.fillText(message, 100, 200);
        this.c2d.strokeStyle = '#000';
        this.c2d.strokeText(message, 100, 200);
    };

    return FieldView;
});
