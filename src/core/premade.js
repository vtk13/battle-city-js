
Premade = function Premade(name)
{
    this.name = name;
    this.level = 1;
    this.userCount = 0;
    this.locked = false; // lock for new users
    this.users = new TList();
    this.messages = new TList();
};

Eventable(Premade.prototype);

Premade.prototype.say = function(message)
{
    this.messages.add(message);
    for (var i in this.messages.items) {
        if (this.messages.items[i].time + 5 * 60 * 1000 < Date.now()) {
            this.messages.remove(this.messages.items[i]);
        }
    }
};

Premade.prototype.join = function(user)
{
    if (!this.locked) {
        // todo extract to user method setPremade()
        if (user.premade) {
            user.premade.unjoin();
        }
        user.premade = this;

        this.users.add(user);
        this.userCount++;
        this.emit('change', {type: 'change', object: this});
        // todo extract to user methods setLives(), setPoints() ?
        user.lives = 4;
        user.points = 0;
        user.emit('change', {type: 'change', object: user});
        return true;
    } else {
        return false;
    }
};

Premade.prototype.unjoin = function(user)
{
    if (this.game) {
        this.game.unjoin(user);
    }
    this.users.remove(user);
    this.userCount--;
    delete user.premade;
    this.emit('change', {type: 'change', object: this});
    if (this.userCount == 0) {
        registry.premades.remove(this);
    }
};

Premade.prototype.startGame = function()
{
    this.locked = true;
    this.game = new Game('../battle-city/maps/level' + this.level);
    this.game.premade = this;
    this.users.forEach(function(user){
        this.game.join(user);
        user.socket.json.send({type: 'started'});
    }, this);
};

Premade.prototype.gameOver = function()
{
    if (this.game) {
        var game = this.game;
        if (this.game.status == 1) {
            this.level++;
            if (this.level > 35) {
                this.level = 1;
            }
            this.emit('change', {type: 'change', object: this});
        }
        this.users.forEach(function(user){
            game.unjoin(user);
            // todo extract
            user.socket.json.send({type: 'gameover'});
        });
        this.game = null;
    }
};

Premade.prototype.serialize = function()
{
    return {
        id: this.id,
        name: this.name,
        level: this.level,
        // todo rename?
        users: this.userCount
    };
};
