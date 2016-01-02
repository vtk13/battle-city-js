define(function() {
    function TankController(tank)
    {
        this.tank = tank;
        var controller = this;
        $(window.document).keydown(this.controlEvent.bind(this));
        $(window.document).keyup  (this.controlEvent.bind(this));
    }

    TankController.prototype.controlEvent = function(e)
    {
    //    console.log(e.keyCode);
    //    console.log(e.type);
        if (e.keyCode == 38 /*up*/) {
            if (e.type == 'keydown') {
                this.tank.turn('north');
                this.tank.startMove();
            } else if (e.type == 'keyup') {
                this.tank.stopMove();
            }
        }
        if (e.keyCode == 39 /*right*/) {
            if (e.type == 'keydown') {
                this.tank.turn('east');
                this.tank.startMove();
            } else if (e.type == 'keyup') {
                this.tank.stopMove();
            }
        }
        if (e.keyCode == 40 /*down*/) {
            if (e.type == 'keydown') {
                this.tank.turn('south');
                this.tank.startMove();
            } else if (e.type == 'keyup') {
                this.tank.stopMove();
            }
        }
        if (e.keyCode == 37 /*left*/) {
            if (e.type == 'keydown') {
                this.tank.turn('west');
                this.tank.startMove();
            } else if (e.type == 'keyup') {
                this.tank.stopMove();
            }
        }
        if (e.keyCode == 70 /*f*/ || e.keyCode == 32) {
            this.tank.fire();
        }
    };

    return TankController;
});