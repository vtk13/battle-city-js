
Clan = function Clan(n, defaultArmoredTimer)
{
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
    var userId = this.users.push(user) - 1;
    user.tank = new Tank();
    user.tank.user = user;
    // before add to field, may set x y directly
    user.tank.initialPosition.x = user.tank.x = 32*this.tankPositions[userId].x + user.tank.hw;
    user.tank.initialPosition.y = user.tank.y = 32*this.tankPositions[userId].y + user.tank.hh;
    user.tank.clan = user.clan = this;
    user.emit('change', {type: 'change', object: user});
};

Clan.prototype.detachUser = function(user)
{
    if (user.clan) {
        if (user.tank.field) {
            user.tank.field.remove(user.tank);
        }
        user.tank.clan = null;
        user.tank = null;
        var i = this.users.indexOf(user);
        if (i >= 0) {
            this.users.splice(i, 1);
        }
        user.clan = null;
        user.emit('change', {type: 'change', object: user});
    }
};

Clan.prototype.size = function()
{
    return this.users.length;
};

Clan.prototype.isFull = function()
{
    return this.users.length == 2;
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
        this.premade.gameOver(this.enemiesClan);
    }
    this.base && this.base.step();
    this.timer > 0 && this.timer--;
};

Clan.prototype.startGame = function(game)
{
    this.game = game;
    for (var i in this.users) {
        if (this.users[i].lives < 0) this.users[i].lives = 0; // todo hack
        this.users[i].tank.resetPosition();
        this.game.field.add(this.users[i].tank);
    }
    if (this.base) {
        this.base.shootDown = false;
        this.base.shootDownTimer = Base.shootDownTimer;
        this.base.x = this.game.field.width /  2;
        this.base.y = (this.n == 1) ? (this.game.field.height - 16) : 16;
        this.game.field.add(this.base);
    }
};

BotsClan = function BotsClan(n)
{
    Clan.apply(this, arguments);
    this.base = null;
    this.tankPositions = Clan.tankPositions['bots'];
};

BotsClan.prototype = new Clan();
BotsClan.prototype.constructor = BotsClan;


BotsClan.prototype.isFull = function()
{
    return this.users.length == 6;
};

BotsClan.prototype.step = function()
{
    if (this.users.length == 0 && this.botStack.count() == 0) {
        this.premade.gameOver(this.enemiesClan);
    }

    if (!this.isFull() && this.botStack.count() > 0 && Math.random() < 0.01) {
        var botX = this.tankPositions[this.currentBotPosition].x;
        var botY = this.tankPositions[this.currentBotPosition].y;
        if (this.game.field.canPutTank(botX, botY)) {
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

BotsClan.prototype.startGame = function(game)
{
    this.game = game;
    var bots = this.users = [];
    this.game.field.on('remove', function(event) {
        for (var i in bots) {
            if (bots[i].tank == event.object) {
                bots.splice(i, 1);
            }
        }
    });
    this.currentBotPosition = 0;

    this.botStack = new TList();

    // todo move from this function
    for (var i in this.game.enemies) {
        var bonus = ['4','11','18'].indexOf(i) >= 0;
        var bot;
//        var bonus = true;
        switch (this.game.enemies[i]) {
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
        bot.id = Field.autoIncrement++; // todo hack, to bots in stack have id on client (see TItemList.prototype.add)
        this.botStack.add(bot);
    }
};
