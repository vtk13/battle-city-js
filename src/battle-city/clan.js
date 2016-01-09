define([
    'src/engine/store/collection.js',
    'src/battle-city/objects/tank.js',
    'src/battle-city/objects/base.js'
], function(
    Collection,
    Tank,
    Base
) {
    function Clan(n, defaultArmoredTimer)
    {
        this.capacity = 2; // max users
        this.n = n; // todo is this id?
        this.defaultArmoredTimer = defaultArmoredTimer;
        this.pauseTimer = 0;
        this.enemiesClan = null;
        this.users = [];
        this.base = new Base(); // todo move to field?
        this.base.clan = this;
        this.tankPositions = Clan.tankPositions['clan' + n]; // todo move to BotEmitter?
    }

    Clan.tankPositions = {
        'clan1': [{x:  4, y: 12}, {x: 8, y: 12}],
        'clan2': [{x:  4, y:  0}, {x: 8, y:  0}]
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
        user.tank = new Tank(); // todo move to field?
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
                this.users[i].tank.step(this.pauseTimer > 0);
                activeUsers++;
            }
        }
        if (activeUsers == 0) {
            this.base.hit();
        }
        this.pauseTimer > 0 && this.pauseTimer--;
    };

    Clan.prototype.startGame = function(field)
    {
        this.field = field;
        for (var i in this.users) {
            var user = this.users[i];
            if (user.lives < 0) user.lives = 0; // todo hack
            // before add to field, may set x y directly
            user.tank.initialPosition.x = user.tank.x = 32*this.tankPositions[i].x + user.tank.hw;
            user.tank.initialPosition.y = user.tank.y = 32*this.tankPositions[i].y + user.tank.hh;
            user.tank.resetPosition();
            field.add(user.tank);
            user.emit('change'); // user.tankId
        }
        this.base.shootDown = false;
        this.base.x = field.width /  2;
        this.base.y = (this.n == 1) ? (field.height - 16) : 16;
        field.add(this.base);
    };

    Clan.prototype.pauseTanks = function()
    {
        this.pauseTimer = 3 * 30; // 30 steps per second
    };

    return Clan;
});
