define([
    'src/common/func.js',
    'src/battle-city/field.js',
    'src/battle-city/objects/tank.js',
    'src/battle-city/objects/base.js'
], function(
    func,
    Field,
    Tank,
    Base
) {
    function Game(map, premade)
    {
        this.running = true; // premade set this to false before game over
        this.premade = premade;
        this.stepableItems = [];

        this.field = func.isClient() ? window.bcClient.field : new Field(13*32, 13*32);
        this.field.game = this;
        this.field.on('add', this.onAddObject.bind(this));
        this.field.on('remove', this.onRemoveObject.bind(this));

        this.field.terrain(map);
    }

    Game.prototype.onAddObject = function(object) {
        if (object.step && !(object instanceof Tank) && !(object instanceof Base)) {
            this.stepableItems[object.id] = object;
        }
    };

    Game.prototype.onRemoveObject = function(object) {
        delete this.stepableItems[object.id];
    };

    Game.prototype.start = function()
    {
        this.stepIntervalId = setInterval(this.step.bind(this), 30);
    };

    Game.prototype.gameOver = function()
    {
        clearInterval(this.stepIntervalId);
        this.field.removeAllListeners();
    //    this.field.game = null; // todo when game finished, next item.step() failed
    //    this.field = null;
    };

    Game.prototype.step = function()
    {
        for (var i in this.stepableItems) {
            this.stepableItems[i].step(); // bullets only now
        }
        this.premade.clans[0].step();
        this.premade.clans[1].step();
    };

    return Game;
});
