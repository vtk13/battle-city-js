function isClient() {
    return true;
};

function BcClient(href) {
    this.user = new User(); // do not replace
    this.botSource = null;
    this.socket = io.connect(href, {
        'auto connect' : false,
        'reconnect' : false // todo learn reconnection abilities
    });

    this.users = new TList();
    this.users.on('add'   , this.onUserChange.bind(this));
    this.users.on('change', this.onUserChange.bind(this));

    this.premades = new TList();
    this.currentPremade = new Premade(); // do not replace
    this.premades.on('add'   , this.onPremadeChange.bind(this));
    this.premades.on('change', this.onPremadeChange.bind(this));
    this.premades.on('remove', this.onPremadeChange.bind(this));

    this.messages = new TList();
    this.premadeUsers = new TList();
    this.premadeMessages = new TList();
    // todo move to premade object?
    this.tankStack = new TList();
    this.socket.on('sync', this.onSync.bind(this));
    this.socket.on('clearCollection', this.onClearCollection.bind(this));
    this.socket.on('logged', this.onLogged.bind(this));
    this.socket.on('joined', this.onJoined.bind(this));
    this.socket.on('unjoined', this.onUnjoined.bind(this));
    this.socket.on('started', this.onStarted.bind(this));
    this.socket.on('gameover', this.onGameOver.bind(this));

    this.field = new Field(13 * 32, 13 * 32);
};

BcClient.prototype.onUserChange = function(user)
{
    if (user.id == this.user.id) {
        this.user.unserialize(user.serialize());
    }
};

BcClient.prototype.onSync = function(data) {
    if (data['users']) {
        this.users.updateWith(data['users']);
    }
    if (data['premades']) {
        this.premades.updateWith(data['premades']);
    }
    if (data['messages']) {
        this.messages.updateWith(data['messages']);
    }

    if (data['premade.users']) {
        this.premadeUsers.updateWith(data['premade.users']);
    }
    if (data['premade.messages']) {
        this.premadeMessages.updateWith(data['premade.messages']);
    }

    if (data['game.botStack']) {
        this.tankStack.updateWith(data['game.botStack']);
    }
    if (data['f']) {
        this.field.updateWith(data['f']);
    }
};

BcClient.prototype.onClearCollection = function(data) {
    switch (data) {
    case 'premade.users':
        this.premadeUsers.clear();
        break;
    case 'premade.messages':
        this.premadeMessages.clear();
        break;
    case 'game.botStack':
        this.tankStack.clear();
        break;
    case 'f':
        this.field.clear();
        break;
    }
};

BcClient.prototype.onLogged = function(data) {
    this.user.unserialize(data.user);
};

BcClient.prototype.onJoined = function(data) {
    // do not replace this.currentPremade
    this.currentPremade.unserialize(data.premade);
};

BcClient.prototype.onUnjoined = function() {
    // do not replace this.currentPremade
    this.currentPremade.unserialize([]);
    clearInterval(this.botCodeInterval);
};

BcClient.prototype.onStarted = function() {
    if (this.botSource) {
        var self = this;
        var store = {};
        this.botCodeInterval = setInterval(function() {
            var tank = {
                getX        : function()
                    {
                        return self.field.get(self.user.tankId).x;
                    },
                getY        : function()
                    {
                        return self.field.get(self.user.tankId).y;
                    },
                startMove   : self.startMove.bind(self),
                stopMove    : self.stopMove.bind(self),
                fire        : self.fire.bind(self)
            };
            var field = {
                intersect: function(x, y, hw, hh, types)
                {
                    var res = [];
                    switch (true) {
                        case types === undefined:
                            var tmp = self.field.intersect.call(self.field, {}, x, y, hw, hh);
                            for (var i in tmp) {
                                res.push(tmp[i]);
                            }
                        break;
                        case Array.isArray(types):
                            var tmp = self.field.intersect.call(self.field, {}, x, y, hw, hh);
                            for (var i in tmp) {
                                for (var t in types) {
                                    if (tmp[i] instanceof types[t]) {
                                        res.push(tmp[i]);
                                        break;
                                    }
                                }
                            }
                        break;
                        case types instanceof Function:
                            var tmp = self.field.intersect.call(self.field, {}, x, y, hw, hh);
                            for (var i in tmp) {
                                if (tmp[i] instanceof types) {
                                    res.push(tmp[i]);
                                }
                            }
                        break;
                    }
                    return res;
                }
            };
            eval(self.botSource);
        }, 50);
    }
};

BcClient.prototype.onGameOver = function() {
    if (this.botSource) {
        clearInterval(this.botCodeInterval);
        this.botSource = null;
    }
};

BcClient.prototype.onPremadeChange = function(premade) {
    if (this.currentPremade.id == premade.id) {
        this.currentPremade.unserialize(premade.serialize());
        this.currentPremade.emit('change');
    }
};

// ===== actions
// ================================================================

BcClient.prototype.connect = function() {
    this.socket.socket.connect();
};

BcClient.prototype.login = function(nick) {
    this.socket.emit('login', {
        nick : nick
    });
};

BcClient.prototype.say = function(text) {
    this.socket.emit('say', {
        text : text
    });
};

BcClient.prototype.join = function(name, gameType) {
    this.socket.emit('join', {
        name : name,
        gameType : gameType
    });
};

BcClient.prototype.unjoin = function() {
    this.socket.emit('unjoin');
};

BcClient.prototype.startGame = function(level) {
    this.socket.emit('start', {
        level : level
    });
};

BcClient.prototype.stopGame = function() {
    if (this.currentPremade.type == 'createbot') {
        this.socket.emit('stop-game');
    }
};

BcClient.prototype.startMove = function(direction) {
    this.socket.emit('control', {
        move : direction
    });
};

BcClient.prototype.stopMove = function() {
    this.socket.emit('control', {
        stop : 1
    });
};

BcClient.prototype.fire = function() {
    this.socket.emit('control', {
        fire : 1
    });
};

// ===== events
// =================================================================

// todo named similar to handlers onLogged, onJoined, etc
BcClient.prototype.onConnect = function(handler) {
    this.socket.on('connect', handler);
};

BcClient.prototype.onConnectFail = function(handler) {
    this.socket.on('connect_failed', handler).on('error', handler);
};
