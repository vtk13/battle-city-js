
Game = function Game(level, premade)
{
    this.premade = premade;
    // 1 - win, 0 - fail
    this.status = -1;
    this._stepCounter = 0;

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
    var level = require(level);
    this.field.terrain(level.map, level.enemies.reverse());

    this.stepIntervalId = setInterval(callback(this.step, this), 30);
};

Game.tankPositions = [{x:4, y:12}, {x:8, y:12}, {x:4, y:0}, {x:8, y:0}];

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
    // before add to field, may set x y directly
    user.tank.initialPosition.x = user.tank.x = 32*Game.tankPositions[userId].x + user.tank.hw;
    user.tank.initialPosition.y = user.tank.y = 32*Game.tankPositions[userId].y + user.tank.hh;
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

Game.prototype._stepItem = function(item)
{
    item.step && item.step(this.field.timer > 0);
};

Game.prototype.step = function()
{
    this._stepCounter++;
    if ((this._stepCounter % 300) == 0) { // ~10 seconds (30ms step)
        this.field.clearRemoved(Date.now() - 10 * 1000);
    }
    this.field.objects.traversal(this._stepItem, this);
    this.field.timer > 0 && this.field.timer--;

    if (this.bots.length == 0 && this.botStack.count() == 0) {
        this.gameOver(1);
    }

    if (this.bots.length < 6 && this.botStack.count() > 0 && Math.random() < 0.01) {
        var botX = this.botsEmitters[this.botsEmitters.current].x;
        var botY = this.botsEmitters[this.botsEmitters.current].y;
        if (this.field.canPutTank(botX, botY)) {
            var bot = this.botStack.pop();
            delete bot['id'];
            bot.removeAllListeners('change');
            // before add to field, may set x y directly
            bot.x = botX;
            bot.y = botY;
            this.bots.push(bot);
            this.field.add(bot); // remove handler defined in constructor

            this.botsEmitters.current = (this.botsEmitters.current + 1) % 3;
        }
    }
};
