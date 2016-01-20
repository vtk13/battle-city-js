var Clan = require('src/battle-city/clan.js');
var tankbot = require('src/battle-city/objects/tankbot.js');

module.exports = BotsClan;

// todo убрать понятие user из этого класса
function BotsClan(n)
{
    Clan.apply(this, arguments);
    this.capacity = 6;
    this.tankPositions = [{x: 16, y: 16}, {x: 13*32 / 2, y: 16}, {x: 13*32 - 16, y: 16}];
    this.botStack = [];
}

BotsClan.prototype = Object.create(Clan.prototype);
BotsClan.prototype.constructor = BotsClan;

BotsClan.prototype.isBots = function()
{
    return true;
};

BotsClan.prototype.step = function()
{
    if (this.users.length == 0 && this.botStack.length == 0) {
        this.premade.gameOver(this.enemiesClan);
    }

    if (!this.isFull() && this.botStack.length > 0 && Math.random() < 0.01) {
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
    for (var i in this.users) {
        if (this.users[i].tank == bot) {
            this.users.splice(i, 1);
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
    this.users.push({tank: bot});
    return bot;
};

BotsClan.prototype.pauseTanks = function()
{
    for (var i in this.users) {
        var user = this.users[i];
        if (user.tank) {
            user.tank.pauseTimer = 10 * 30; // 30 steps per second
        }
    }
};
