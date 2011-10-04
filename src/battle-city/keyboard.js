TankController = function TankController(tank)
{
    this.tank = tank;
    this.keys = new Array();
    var controller = this;
    $(window.document).keydown(function(e){controller.controlEvent(e);});
    $(window.document).keyup  (function(e){controller.controlEvent(e);});
};

TankController.prototype.controlEvent = function(e)
{
//    console.log(e.keyCode);
//    console.log(e.type);
    if (e.keyCode == 38 /*up*/) {
        if (e.type == 'keydown') {
            this.tank.startMove('up');
        } else if (e.type == 'keyup') {
            this.tank.stopMove();
        }
    }
    if (e.keyCode == 39 /*right*/) {
        if (e.type == 'keydown') {
            this.tank.startMove('right');
        } else if (e.type == 'keyup') {
            this.tank.stopMove();
        }
    }
    if (e.keyCode == 40 /*down*/) {
        if (e.type == 'keydown') {
            this.tank.startMove('down');
        } else if (e.type == 'keyup') {
            this.tank.stopMove();
        }
    }
    if (e.keyCode == 37 /*left*/) {
        if (e.type == 'keydown') {
            this.tank.startMove('left');
        } else if (e.type == 'keyup') {
            this.tank.stopMove();
        }
    }
    if (e.keyCode == 70 /*f*/ || e.keyCode == 32) {
        this.tank.fire();
    }
};
