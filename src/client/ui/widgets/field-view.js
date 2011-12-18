
function FieldView(context, client)
{
    this.field = client.field;
    this.context = context;
    this.c2d = $('#field', context).get(0).getContext('2d');
    this.c2d.font ="bold 25px Arial";
    this.step = 1;
    this.animateIntervalId = null;
    var self = this;

    this.field.on('remove', function(object){
        if (object instanceof Bullet) {
            var anim = new BulletHitAnimation(self.step, object.finalX, object.finalY);
            anim.id = object.id;
            self.field.add(anim);
        }
        if (object instanceof Tank) { // todo hit myself without splash :(
            var anim = new TankHitAnimation(self.step, object.x, object.y);
            anim.id = object.id;
            self.field.add(anim);
        }
    });

    client.socket.on('gameover', function(event) {
        clearInterval(self.animateIntervalId);
        if (event.winnerClan == client.user.clan) {
            self.message('Победа!');
        } else {
            self.message('Вы проиграли');
        }
    });
    client.socket.on('disconnect', function() {
        clearInterval(self.animateIntervalId);
    });
    client.socket.on('unjoined', function(){
        clearInterval(self.animateIntervalId);
    });
    client.socket.on('started', function(){
        clearInterval(self.animateIntervalId);
        if (window.location.hash != '#test') {
            self.animateIntervalId =
                setInterval(self.animateStep.bind(self), 50);
        }
    });
};

FieldView.prototype._animateStepItem = function(item)
{
    item.animateStep && item.animateStep(this.step);
};

FieldView.prototype.animateStep = function()
{
    this.field.objects.traversal(FieldView.prototype._animateStepItem, this);
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
    this.c2d.fillStyle = 'rgba(0, 0, 0, 1)';
    this.c2d.fillRect(0, 0, this.field.width, this.field.height);

    if (this.context.hasClass('create-bot')) {
        this.c2d.strokeStyle = '#0a0a0a';
        this.c2d.lineWidth = 1;
        for (var i = 1 ; i < 26 ; i++) {
            this.c2d.beginPath();
            this.c2d.moveTo(0, 16 * i + 0.5);
            this.c2d.lineTo(416, 16 * i + 0.5);
            this.c2d.closePath();
            this.c2d.stroke();
        }
        for (var i = 1 ; i < 26 ; i++) {
            this.c2d.beginPath();
            this.c2d.moveTo(16 * i + 0.5, 0);
            this.c2d.lineTo(16 * i + 0.5, 416);
            this.c2d.closePath();
            this.c2d.stroke();
        }
    }

    for (this.z = 0 ; this.z <= 2 ; this.z++) { // this.z hack?
        this.field.objects.traversal(this.drawItem, this);
    }
};

FieldView.prototype.message = function(message)
{
    this.c2d.fillStyle = '#fff';
    this.c2d.fillText(message, 100, 200);
    this.c2d.strokeStyle = '#000';
    this.c2d.strokeText(message, 100, 200);
};
