
Game = function Game(level)
{
    // 1 - win, 0 - fail
    this.status = -1;

    this.field = new Field(13*32, 13*32);
    this.field.game = this;

    this.users = new Array();
    var bots = this.bots = new Array();
    this.field.on('remove', function(event) {
        for (var i in bots) {
            if (bots[i] == event.object) {
                bots.splice(i, 1);
            }
        }
    });

    this.botsEmitters = new Array(
            new BotEmitter(16, 16),
            new BotEmitter(this.field.width / 2, 16),
            new BotEmitter(this.field.width - 16, 16));
    this.botsEmitters.current = 0;

    this.botStack = new TList();
    this.field.terrain(require(level).map);

    this.stepIntervalId = setInterval(callback(this.step, this), 30);
};

Game.prototype.gameOver = function(status)
{
    if (this.status == -1) {
        this.status = status;
        clearInterval(this.stepIntervalId);
        this.premade.gameOver();
    }
};

Game.prototype.join = function(user)
{
    if (user.game) {
        user.game.unjoin();
    }
    user.game = this;
    var userId = this.users.push(user) - 1;
    user.tank = new Tank();
    user.tank.user = user;
    user.tank.initialPosition.x = user.tank.x = 32*4 + user.tank.hw + userId * 4*32;
    user.tank.initialPosition.y = user.tank.y = 32*12 + user.tank.hh;
    this.field.add(user.tank);
};

Game.prototype.unjoin = function(user)
{
    if (user.game == this) {
        this.field.remove(user.tank);
        user.tank = null;
        for (var i in this.users) {
            if (this.users[i] == user) {
                user.game = null;
                this.users.splice(i, 1);
            }
        }
        if (this.users.length == 0) {
            this.gameOver(0);
        }
    }
};

Game.prototype.step = function()
{
    this.field.objects.forEach(function(item){
        if (item.step) {
            item.step();
        }
    });

    if (this.bots.length == 0 && this.botStack.count() == 0) {
        this.gameOver(1);
    }

    if (this.bots.length < 6 && this.botStack.count() > 0 && Math.random() < 0.01) {
        var botX = this.botsEmitters[this.botsEmitters.current].x;
        var botY = this.botsEmitters[this.botsEmitters.current].y;
        if (this.field.intersect({x: botX, y: botY, hw: 16, hh: 16}).length == 0) {
            var bot = this.botStack.pop();
            delete bot['id'];
            bot.removeAllListeners('change');
            bot.x = botX;
            bot.y = botY;

            this.bots.push(bot);
            this.field.add(bot); // remove handler defined in constructor

            this.botsEmitters.current = (this.botsEmitters.current + 1) % 3;
        }
    }
};
