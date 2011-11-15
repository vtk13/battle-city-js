
Premade = function Premade(name, type)
{
    this.name = name;
    this.type = type || 'team-vs-team';
    this.level = 1;
    this.userCount = 0;
    this.locked = false; // lock for new users
    this.users = new TList(); // todo move to clan?
    this.clans = [new Clan(), new Clan()];
    this.clans[0].enemiesClan = this.clans[1];
    this.clans[1].enemiesClan = this.clans[0];
    this.messages = new TList();
};

Eventable(Premade.prototype);

Premade.types = ['classic', 'team-vs-team'];

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
    if (this.type == 'team-vs-team' && this.clans[clanId].isFull()) {
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
    if (this.game) {
        this.game.unjoin(user);
    }
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
    this.users.traversal(function(user){
        this.game.join(user);
        user.sendToClient({type: 'started'});
    }, this);
};

Premade.prototype.gameOver = function()
{
    if (this.game) {
        if (this.game.status == 1) {
            this.level++;
            if (this.level > 35) {
                this.level = 1;
            }
            this.emit('change', {type: 'change', object: this});
        }
        this.users.traversal(function(user){
            this.game.unjoin(user);
            // todo extract
            user.sendToClient({type: 'gameover'});
        }, this);
        this.game = null;
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
