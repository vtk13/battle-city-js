var $ = require('jquery');

module.exports = TankController;

function TankController(tankApi)
{
    this.tankApi = tankApi;
    $(window.document).keydown(this.controlEvent.bind(this));
    $(window.document).keyup(this.controlEvent.bind(this));
}

TankController.prototype.controlEvent = function(e)
{
//    console.log(e.keyCode);
//    console.log(e.type);
    if (e.keyCode == 38 /*up*/) {
        if (e.type == 'keydown') {
            this.tankApi.turn('north');
            this.tankApi.startMove();
        } else if (e.type == 'keyup') {
            this.tankApi.stopMove();
        }
    }
    if (e.keyCode == 39 /*right*/) {
        if (e.type == 'keydown') {
            this.tankApi.turn('east');
            this.tankApi.startMove();
        } else if (e.type == 'keyup') {
            this.tankApi.stopMove();
        }
    }
    if (e.keyCode == 40 /*down*/) {
        if (e.type == 'keydown') {
            this.tankApi.turn('south');
            this.tankApi.startMove();
        } else if (e.type == 'keyup') {
            this.tankApi.stopMove();
        }
    }
    if (e.keyCode == 37 /*left*/) {
        if (e.type == 'keydown') {
            this.tankApi.turn('west');
            this.tankApi.startMove();
        } else if (e.type == 'keyup') {
            this.tankApi.stopMove();
        }
    }
    if (e.keyCode == 70 /*f*/ || e.keyCode == 32) {
        this.tankApi.fire();
    }
};
