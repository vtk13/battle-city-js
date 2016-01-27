var tankbot = require('src/battle-city/objects/tankbot.js');
var Odb = require('src/engine/store/odb.js');

module.exports = BotsClan;

function BotsClan(n)
{
    this.n = n;
    this.enemiesClan = null;
    this.capacity = 6;
    this.tankPositions = [{x: 16, y: 16}, {x: 13*32 / 2, y: 16}, {x: 13*32 - 16, y: 16}];
    this.bots = [];
    this.botStack = [];
    this.field = null;
}

BotsClan.prototype.size = function()
{
    return this.bots.length;
};

BotsClan.prototype.isFull = function()
{
    return this.bots.length == this.capacity;
};

BotsClan.prototype.isBots = function()
{
    return true;
};

BotsClan.prototype.step = function()
{
    if (this.bots.length == 0 && this.botStack.length == 0) {
        this.premade.gameOver(this.enemiesClan);
    }

    if (!this.isFull() && this.botStack.length > 0 && Odb.instance().random() == 1) {
        var botX = this.tankPositions[this.currentBotPosition].x;
        var botY = this.tankPositions[this.currentBotPosition].y;
        if (this.field && this.field.canPutTank(botX, botY)) {
            var bot = this.createNextBot();
            // before add to field, may set x y directly
            bot.x = botX;
            bot.y = botY;
            this.field.add(bot);

            this.currentBotPosition = (this.currentBotPosition + 1) % 3;
        }
    }
};

BotsClan.prototype.startGame = function(level)
{
    this.currentBotPosition = 0;
    this.botStack = level.getEnemies();
    this.botStack = [this.botStack[0]]; // debug

    if (this.removeListener) {
        this.field.off('remove', this.removeListener);
    }
    this.removeListener = this.removeBot.bind(this);
    this.field.on('remove', this.removeListener);
};

BotsClan.prototype.removeBot = function(bot)
{
    for (var i in this.bots) {
        if (this.bots[i].tank == bot) {
            this.bots.splice(i, 1);
            return;
        }
    }
};

BotsClan.prototype.createNextBot = function()
{
    var type = this.botStack.shift();
    var bonus = [3,10,17].indexOf(20 - this.botStack.length) >= 0;
    var bot;

    switch (type) {
        case 1:
            bot = new tankbot.TankBot(0, 0, bonus);
            break;
        case 2:
            bot = new tankbot.FastTankBot(0, 0, bonus);
            break;
        case 3:
            bot = new tankbot.FastBulletTankBot(0, 0, bonus);
            break;
        case 4:
            bot = new tankbot.HeavyTankBot(0, 0, bonus);
            break;
        default:
            throw new Error('Invalid bot type #' + type + ' or bot stack is empty');
    }

    bot.clan = this;
    this.bots.push(bot);
    return bot;
};

BotsClan.prototype.pauseTanks = function()
{
    for (var i in this.bots) {
        var user = this.bots[i];
        if (user.tank) {
            user.tank.pauseTimer = 10 * 30; // 30 steps per second
        }
    }
};
