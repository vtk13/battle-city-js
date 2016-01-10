var Clan = require('src/battle-city/clan.js');
var tankbot = require('src/battle-city/objects/tankbot.js');
var Collection = require('src/engine/store/collection.js');

// todo убрать понятие user из этого класса
function BotsClan(n)
{
    Clan.apply(this, arguments);
    this.capacity = 6;
    this.tankPositions = [{x: 16, y: 16}, {x: 13*32 / 2, y: 16}, {x: 13*32 - 16, y: 16}];
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
        this.premade.gameOver(this.enemiesClan, 2000);
    }

    if (!this.isFull() && this.botStack.length > 0 && Math.random() < 0.01) {
        var botX = this.tankPositions[this.currentBotPosition].x;
        var botY = this.tankPositions[this.currentBotPosition].y;
        if (this.field && this.field.canPutTank(botX, botY)) {
            var bot = this.botStack.pop();
            delete bot['id'];
            bot.removeAllListeners('change');
            // before add to field, may set x y directly
            bot.x = botX;
            bot.y = botY;
            this.users.push({tank: bot});
            this.field.add(bot); // "remove handler defined in constructor" WFT?

            this.currentBotPosition = (this.currentBotPosition + 1) % 3;
        }
    }
};

BotsClan.prototype.startGame = function(field, level)
{
    this.field = field;
    var bots = this.users = [];
    this.field.on('remove', function(object) {
        for (var i in bots) {
            if (bots[i].tank == object) {
                bots.splice(i, 1);
            }
        }
    });
    this.currentBotPosition = 0;

    this.botStack = new Collection();

    // todo move from this function
    var enemies = level.getEnemies();
    for (var i = enemies.length - 1; i >= 0; i-- ) {
        var bonus = [3,10,17].indexOf(i) >= 0;
        var bot;
        //        var bonus = true;
        switch (enemies[i]) {
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
        }
        bot.clan = this;
        this.botStack.add(bot);
    }
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

module.exports = BotsClan;
