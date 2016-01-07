define([
    'src/common/func.js',
    'src/battle-city/field.js'
], function(
    func,
    Field
) {
    function Game(map, premade)
    {
        this.running = true; // premade set this to false before game over
        this.premade = premade;

        this.field = func.isClient() ? window.bcClient.field : new Field(13*32, 13*32);
        this.field.game = this;

        this.field.terrain(map);
    }

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
        this.field.step();
        this.premade.clans[0].step();
        this.premade.clans[1].step();
    };

    return Game;
});
