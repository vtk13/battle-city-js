
function FieldView(field)
{
    this.field = field;
    this.context = document.getElementById('field').getContext('2d');
    this.step = 1;
    var self = this;
    field.on('remove', function(object){
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
            this.context.drawImage(window.images[current.img[i]],
                    current.x - current.hw,
                    current.y - current.hh);
        }
    }
};

FieldView.prototype.draw = function()
{
    this.context.fillStyle = 'rgba(0, 0, 0, 1)';
    this.context.fillRect(0, 0, this.field.width, this.field.height);
    for (this.z = 0 ; this.z <= 2 ; this.z++) { // this.z hack?
        this.field.objects.traversal(this.drawItem, this);
    }
};
