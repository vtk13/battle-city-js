
function BcClient(socket)
{
    this.users = new TList().bindSource(window.clientServerMessageBus, 'users');
    this.currentUser = new User(); // do not replace
    this.users.bindSlave(this.currentUser);

    this.premades = new TList().bindSource(window.clientServerMessageBus, 'premades');
    this.currentPremade = new Premade(); // do not replace
    this.premades.bindSlave(this.currentPremade);

    this.goals = new TList().bindSource(window.clientServerMessageBus, 'goals');
    this.courses = new TList().bindSource(window.clientServerMessageBus, 'courses');
    this.exercises = new TList().bindSource(window.clientServerMessageBus, 'exercises');

    this.messages = new TList().bindSource(window.clientServerMessageBus, 'messages');
    this.premadeUsers = new TList().bindSource(window.clientServerMessageBus, 'premade.users');
    this.premadeMessages = new TList().bindSource(window.clientServerMessageBus, 'premade.messages');
    // todo move to premade object?
    this.tankStack = new TList().bindSource(window.clientServerMessageBus, 'game.botStack');

    this.field = new Field(13 * 32, 13 * 32);
    TList.prototype.bindSource.call(this.field, window.clientServerMessageBus, 'f');

    this.vmRunner = new VmRunner(this);

    var self = this;
    window.clientServerMessageBus.on('logged', function(data) {
        self.currentUser.unserialize(data.user);
    });
    window.clientServerMessageBus.on('joined', function(data) {
        // do not replace this.currentPremade
        self.currentPremade.unserialize(data.premade);
    });
    window.clientServerMessageBus.on('unjoined', function() {
        // do not replace this.currentPremade
        self.currentPremade.unserialize([]);
    });
};

Eventable(BcClient.prototype);

//===== actions ================================================================

BcClient.prototype.login = function(nick)
{
    window.clientServerMessageBus.emit('login', {
        nick : nick
    });
};

BcClient.prototype.setCourse = function(id)
{
    window.clientServerMessageBus.emit('set-course', {
        id: id
    });
};

BcClient.prototype.say = function(text)
{
    window.clientServerMessageBus.emit('say', {
        text : text
    });
};

BcClient.prototype.join = function(name, gameType)
{
    window.clientServerMessageBus.emit('join', {
        name : name,
        gameType : gameType
    });
};

BcClient.prototype.unjoin = function()
{
    window.clientServerMessageBus.emit('unjoin');
};

BcClient.prototype.startGame = function(level)
{
    var self = this;
    window.clientServerMessageBus.emit('start', {
        level: level
    });
};

BcClient.prototype.stopGame = function()
{
    if (this.currentPremade.type == 'createbot') {
        window.clientServerMessageBus.emit('stop-game');
    }
};

BcClient.prototype.executeCode = function(code)
{
    if (this.currentPremade.gameRun) {
        window.clientServerMessageBus.emit('execute', {
            code: code
        });
        this.vmRunner.executeCode(code);
    }
};

BcClient.prototype.control = function(commands)
{
    window.clientServerMessageBus.emit('control', commands);
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

//===== events =================================================================

BcClient.prototype.onConnect = function(handler)
{
    window.clientServerMessageBus.on('connect', handler);
};

BcClient.prototype.onConnectFail = function(handler)
{
    window.clientServerMessageBus.on('connect_failed', handler).on('error', handler);
};
