
Premade = function Premade(name, type)
{
    this.name = name;
    this.type = type || 'classic';
    this.level = 1;
    this.userCount = 0;
    this.locked = false; // lock for new users
    this.users = new TList(); // todo move to clan?
    switch (this.type) {
        case 'classic':
            this.clans = [new Clan(1), new BotsClan(2)];
            break;
        case 'teamvsteam':
            this.clans = [new Clan(1), new Clan(2)];
            break;
    }
    this.clans[0].premade = this.clans[1].premade = this;
    this.clans[0].enemiesClan = this.clans[1];
    this.clans[1].enemiesClan = this.clans[0];
    this.messages = new TList();
};

Eventable(Premade.prototype);

Premade.types = ['classic', 'teamvsteam'];

Premade.prototype.say = function(message)
{
    this.messages.add(message);
    for (var i in this.messages.items) {
        if (this.messages.items[i].time + 5 * 60 * 1000 < Date.now()) {
            this.messages.remove(this.messages.items[i]);
        }
    }
};

Premade.prototype.setClan = function(user, clanId)
{
    this.clans[clanId].attachUser(user);
};

Premade.prototype.join = function(user, clanId)
{
    clanId = clanId || 0;
    if (this.type == 'teamvsteam' && this.clans[clanId].isFull()) {
        clanId = 1;
    }
    if (!this.locked && !this.clans[clanId].isFull()) {
        // todo extract to user method setPremade()
        if (user.premade) {
            user.premade.unjoin();
        }
        user.premade = this;
        this.clans[clanId].attachUser(user);
        this.users.add(user);
        this.userCount++;
        this.emit('change', {type: 'change', object: this});
        // todo extract to user methods setLives(), setPoints() ?
        user.lives = 4;
        user.points = 0;
        user.emit('change', {type: 'change', object: user});
    } else {
        throw {message: 'К этой игре уже нельзя присоединиться.'};
    }
};

Premade.prototype.unjoin = function(user)
{
    user.clan.detachUser(user);
    this.users.remove(user);
    this.userCount--;
    user.premade = null;
    this.emit('change', {type: 'change', object: this});
    if (this.userCount == 0) {
        registry.premades.remove(this);
    }
};

Premade.prototype.startGame = function()
{
    this.locked = true;
    this.game = new Game('../battle-city/maps/level' + this.level, this);
    this.clans[0].startGame(this.game);
    this.clans[1].startGame(this.game);
    this.users.traversal(function(user){
        user.sendToClient({type: 'started'});
    }, this);
    this.game.start();
};

Premade.prototype.gameOver = function(winnerClan)
{
    if (this.game) {
        this.game.gameOver();
        if (this.type == 'classic' && this.clans[0] == winnerClan) {
            this.level++;
            if (this.level > 35) {
                this.level = 1;
            }
            this.emit('change', {type: 'change', object: this});
        }
        this.users.traversal(function(user){
            user.sendToClient({type: 'gameover'});
        }, this);
        this.clans[0].game = this.clans[1].game = this.game = null;
    }
};

Premade.prototype.serialize = function()
{
    return {
        "1": this.id, // todo hack
        id: this.id,
        name: this.name,
        level: this.level,
        type: this.type,
        // todo rename?
        users: this.userCount
    };
};
