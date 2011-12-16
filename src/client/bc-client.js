function isClient()
{
    return true;
};

function BcClient(href)
{
    this.user = new User(); // do not replace
    this.socket = io.connect(href, {
        'auto connect' : false,
        'reconnect' : false // todo learn reconnection abilities
    });

    this.code = null;
    this.codeInterval = null;

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
    this.socket.on('execute', this.onExecute.bind(this));
    this.socket.on('task-done', this.onTaskDone.bind(this));
    this.socket.on('disconnect', this.onDisconnect.bind(this));

    this.field = new Field(13 * 32, 13 * 32);
    this.gameRun = false; // todo another way?
};

BcClient.prototype.onUserChange = function(user)
{
    if (user.id == this.user.id) {
        this.user.unserialize(user.serialize());
    }
};

BcClient.prototype.onSync = function(data)
{
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

BcClient.prototype.onClearCollection = function(data)
{
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

BcClient.prototype.onDisconnect = function()
{
    clearInterval(this.botCodeInterval);
    clearInterval(this.codeInterval);
};

BcClient.prototype.onLogged = function(data)
{
    this.user.unserialize(data.user);
};

BcClient.prototype.onJoined = function(data)
{
    // do not replace this.currentPremade
    this.currentPremade.unserialize(data.premade);
};

BcClient.prototype.onUnjoined = function()
{
    // do not replace this.currentPremade
    this.currentPremade.unserialize([]);
    clearInterval(this.botCodeInterval);
};

BcClient.prototype.onStarted = function()
{
    this.gameRun = true;
};

BcClient.prototype.onGameOver = function()
{
    this.gameRun = false;
};

BcClient.prototype.onPremadeChange = function(premade)
{
    if (this.currentPremade.id == premade.id) {
        this.currentPremade.unserialize(premade.serialize());
        this.currentPremade.emit('change');
    }
};

/**
 * @todo implement
 * @param data
 * @return
 */
BcClient.prototype.onExecute = function(data)
{
//    data.script
};

BcClient.prototype.onTaskDone = function()
{
    var self = this;
    if (this.code) {
        clearInterval(this.codeInterval);
        this.codeInterval = setInterval(function(){
            self.code.step();
        }, 1);
    }
};

// ===== actions ================================================================

BcClient.prototype.connect = function()
{
    this.socket.socket.connect();
};

BcClient.prototype.login = function(nick)
{
    this.socket.emit('login', {
        nick : nick
    });
};

BcClient.prototype.say = function(text)
{
    this.socket.emit('say', {
        text : text
    });
};

BcClient.prototype.join = function(name, gameType)
{
    this.socket.emit('join', {
        name : name,
        gameType : gameType
    });
};

BcClient.prototype.unjoin = function()
{
    if (this.code) {
        clearInterval(this.codeInterval);
        this.code.removeAllListeners();
        this.code = null;
    }

    this.socket.emit('unjoin');
};

BcClient.prototype.startGame = function(level)
{
    var self = this;
    this.socket.emit('start', {
        level: level
    });
};

BcClient.prototype.stopGame = function()
{
    if (this.currentPremade.type == 'createbot') {
        this.socket.emit('stop-game');
    }

    if (this.code) {
        clearInterval(this.codeInterval);
        this.code.removeAllListeners();
        this.code = null;
    }
};

BcClient.prototype.executeCode = function(code)
{
    if (this.gameRun) {
        this.socket.emit('execute', {
            code: code
        });

        if (this.code) {
            clearInterval(this.codeInterval);
            this.code.removeAllListeners();
        }
        this.code = new Vm(code);
        var self = this;
        this.code.on('action', function(action){
            clearInterval(self.codeInterval);
            if (action.move) {
                self.move(action.move);
            }
            if (action.turn) {
                self.turn(action.turn);
            }
        });
        this.code.on('terminate', function(action){
            clearInterval(self.codeInterval);
            console.log('terminate');
        });
        this.codeInterval = setInterval(function(){
            self.code.step();
        }, 1);
    }
};

BcClient.prototype.control = function(commands)
{
    this.socket.emit('control', commands);
};

BcClient.prototype.turn = function(direction)
{
    this.control({
        turn: direction
    });
};

BcClient.prototype.move = function(distance)
{
    this.control({
        move: distance
    });
};

BcClient.prototype.startMove = function()
{
    this.control({
        startMove: 1
    });
};

BcClient.prototype.stopMove = function()
{
    this.control({
        stopMove: 1
    });
};

BcClient.prototype.fire = function()
{
    this.control({
        fire: 1
    });
};

// ===== events
// =================================================================

// todo named similar to handlers onLogged, onJoined, etc
BcClient.prototype.onConnect = function(handler)
{
    this.socket.on('connect', handler);
};

BcClient.prototype.onConnectFail = function(handler)
{
    this.socket.on('connect_failed', handler).on('error', handler);
};
