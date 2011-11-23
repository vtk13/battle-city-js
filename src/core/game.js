
Game = function Game(level, premade)
{
    this.premade = premade;
    this.stepableItems = [];

    this.field = new Field(13*32, 13*32);
    this.field.game = this;
    this.field.on('add', this.onAddObject.bind(this));
    this.field.on('remove', this.onRemoveObject.bind(this));

    var level = require(level);
    this.enemies = level.enemies;
    this.field.terrain(level.map);
};

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
    this.stepIntervalId = setInterval(callback(this.step, this), 30);
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
        this.stepableItems[i].step();
    }
    this.premade.clans[0].step();
    this.premade.clans[1].step();
};
