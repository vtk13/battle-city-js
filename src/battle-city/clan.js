
Clan = function Clan(n, defaultArmoredTimer)
{
    this.capacity = 2; // max users
    this.n = n;
    this.defaultArmoredTimer = defaultArmoredTimer;
    this.timer = 0;
    this.enemiesClan = null;
    this.users = [];
    this.base = new Base();
    this.base.clan = this;
    this.tankPositions = Clan.tankPositions['clan' + n];
};

Clan.tankPositions = {
    'clan1': [{x:4, y:12}, {x:8, y:12}],
    'clan2': [{x:4, y:0}, {x:8, y:0}],
    'bots' : [{x: 16, y:16}, {x: 13*32 / 2, y:16}, {x: 13*32 - 16, y: 16}]
};

Clan.prototype.attachUser = function(user)
{
    if (user.clan) user.clan.detachUser(user);
    for (var positionId = 0; positionId < this.capacity; positionId++) {
        if (this.users[positionId] === undefined) {
            this.users[positionId] = user;
            user.positionId = positionId;
            break;
        }
    }
    user.tank = new Tank();
    user.tank.user = user;
    user.tank.clan = user.clan = this;
    user.emit('change');
};

Clan.prototype.detachUser = function(user)
{
    if (this.users[user.positionId] == user) {
        delete this.users[user.positionId];
        if (user.tank.field) {
            user.tank.field.remove(user.tank);
        }
        user.tank.clan = null;
        user.tank = null;
        user.clan = null;
        user.emit('change');
    }
};

Clan.prototype.size = function()
{
    var res = 0;
    for (var i = 0; i < this.capacity; i++) {
        if (this.users[i]) {
            res++;
        }
    }
    return res;
};

Clan.prototype.isFull = function()
{
    return this.size() == this.capacity;
};

/**
 * is this clan of classic bot team
 * @return
 */
Clan.prototype.isBots = function()
{
    return false;
};

Clan.prototype.step = function()
{
    var activeUsers = 0;
    for (var i in this.users) {
        if (this.users[i].lives >= 0) {
            this.users[i].tank.step(this.timer > 0);
            activeUsers++;
        }
    }
    if (activeUsers == 0) {
        this.base.hit();
    }
    this.base.step();
    this.timer > 0 && this.timer--;
};

Clan.prototype.startGame = function(game)
{
    this.game = game;
    for (var i in this.users) {
        var user = this.users[i];
        if (user.lives < 0) user.lives = 0; // todo hack
        // before add to field, may set x y directly
        user.tank.initialPosition.x = user.tank.x = 32*this.tankPositions[i].x + user.tank.hw;
        user.tank.initialPosition.y = user.tank.y = 32*this.tankPositions[i].y + user.tank.hh;
        user.tank.resetPosition();
        this.game.field.add(user.tank);
        user.emit('change'); // user.tankId
    }
    this.base.shootDown = false;
    this.base.shootDownTimer = Base.shootDownTimer;
    this.base.x = this.game.field.width /  2;
    this.base.y = (this.n == 1) ? (this.game.field.height - 16) : 16;
    this.game.field.add(this.base);
};

Clan.prototype.pauseTanks = function()
{
    this.timer = 3 * 30; // 30 steps per second
};

BotsClan = function BotsClan(n)
{
    Clan.apply(this, arguments);
    this.capacity = 6;
    this.tankPositions = Clan.tankPositions['bots'];
};

BotsClan.prototype = new Clan();
BotsClan.prototype.constructor = BotsClan;

BotsClan.prototype.isBots = function()
{
    return true;
};
BotsClan.prototype.step = function()
{
    if (this.users.length == 0 && this.botStack.count() == 0) {
        this.base.hit();
    }
    this.base.step();

    if (!this.isFull() && this.botStack.count() > 0 && Math.random() < 0.01) {
        var botX = this.tankPositions[this.currentBotPosition].x;
        var botY = this.tankPositions[this.currentBotPosition].y;
        if (this.game && this.game.field.canPutTank(botX, botY)) {
            var bot = this.botStack.pop();
            delete bot['id'];
            bot.removeAllListeners('change');
            // before add to field, may set x y directly
            bot.x = botX;
            bot.y = botY;
            this.users.push({tank: bot});
            this.game.field.add(bot); // "remove handler defined in constructor" WFT?

            this.currentBotPosition = (this.currentBotPosition + 1) % 3;
        }
    }

    for (var i in this.users) {
        this.users[i].tank.step(this.timer > 0);
    }
    this.timer > 0 && this.timer--;
};

BotsClan.prototype.startGame = function(game, level)
{
    this.game = game;
    var bots = this.users = [];
    this.game.field.on('remove', function(object) {
        for (var i in bots) {
            if (bots[i].tank == object) {
                bots.splice(i, 1);
            }
        }
    });
    this.currentBotPosition = 0;

    this.botStack = new TList();

    // todo move from this function
    for (var i = level.enemies.length - 1; i >= 0; i-- ) {
        var bonus = [3,10,17].indexOf(i) >= 0;
        var bot;
//        var bonus = true;
        switch (level.enemies[i]) {
            case 1:
                bot = new TankBot(0, 0, bonus);
                break;
            case 2:
                bot = new FastTankBot(0, 0, bonus);
                break;
            case 3:
                bot = new FastBulletTankBot(0, 0, bonus);
                break;
            case 4:
                bot = new HeavyTankBot(0, 0, bonus);
                break;
        }
        bot.clan = this;
        bot.id = Field.autoIncrement++; // todo hack, to bots in stack have id on client
        this.botStack.add(bot);
    }

    this.base.shootDown = false;
    this.base.shootDownTimer = Base.shootDownTimer;
};

BotsClan.prototype.pauseTanks = function()
{
    this.timer = 10 * 1000/30; // 30ms step
};


LearnerClan = function LearnerClan(n)
{
    Clan.apply(this, arguments);
};

LearnerClan.prototype = new Clan();
LearnerClan.prototype.constructor = LearnerClan;

LearnerClan.prototype.startGame = function(game, level)
{
    this.game = game;

    this.base.shootDown = false;
    this.base.shootDownTimer = Base.shootDownTimer;
    this.base.x = this.game.field.width /  2;
    this.base.y = (this.n == 1) ? (this.game.field.height - 16) : 16;
    
    if (level.checkpoint) {
        this.checkpoint = new Checkpoint(level.checkpoint.x, level.checkpoint.y);
    }
    this.game.field.add(this.checkpoint);
//    this.game.field.add(this.base);
};

LearnerClan.prototype.step = function()
{
    if (this.checkpoint && this.game) {
        var res = this.game.field.intersect(this.checkpoint);
        for (var i in res) {
            if (res[i].clan == this.enemiesClan && res[i] instanceof Tank) {
                var self = this;
                // todo move all endgame timeouts to premade
                setTimeout(function(){
                    self.premade.gameOver(self.enemiesClan);
                }, 1000);
            }
        }
    }
    this.base.step();
};
