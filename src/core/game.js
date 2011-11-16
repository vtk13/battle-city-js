
Game = function Game(level, premade)
{
    this.premade = premade;
    this._stepCounter = 0;

    this.field = new Field(13*32, 13*32);
    this.field.game = this;

    var level = require(level);
    this.enemies = level.enemies;
    this.field.terrain(level.map);
};

Game.prototype.start = function()
{
    this.stepIntervalId = setInterval(callback(this.step, this), 30);
};


Game.prototype.gameOver = function()
{
    clearInterval(this.stepIntervalId);
    this.field.removeAllListeners();
//    this.field.game = null; // todo when game finished, next _stepItem() failed
//    this.field = null;
};

Game.prototype._stepItem = function(item)
{
    // tanks and Base processing within Clan.step
    if (item.step && !(item instanceof Tank) && !(item instanceof Base)) { // todo
        item.step();
    }
};

Game.prototype.step = function()
{
    this._stepCounter++;
    if ((this._stepCounter % 300) == 0) { // ~10 seconds (30ms step)
        this.field.clearRemoved(Date.now() - 10 * 1000);
    }
    this.field.objects.traversal(this._stepItem, this);
    this.premade.clans[0].step();
    this.premade.clans[1].step();
};
