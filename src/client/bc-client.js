define(['src/common/event.js',
        'src/common/collection.js',
        'src/common/user.js',
        'src/common/premade.js',
        'src/battle-city/field.js',
        'src/vm/vm-runner.js'], function(Eventable, Collection, User, Premade, Field,
                VmRunner) {
    function BcClient(socket)
    {
        this.socket = socket;

        this.users = new Collection().bindSource(socket, 'users');
        this.currentUser = new User(); // do not replace @todo allow replace
        this.users.bindSlave(this.currentUser);

        this.premades = new Collection().bindSource(socket, 'premades');
        this.currentPremade = new Premade(); // do not replace @todo allow replace
        this.premades.bindSlave(this.currentPremade);

        this.goals = new Collection().bindSource(socket, 'goals');
        this.courses = new Collection().bindSource(socket, 'courses');
        this.exercises = new Collection().bindSource(socket, 'exercises');

        this.messages = new Collection().bindSource(socket, 'messages');
        this.premadeUsers = new Collection().bindSource(socket, 'premade.users');
        this.premadeMessages = new Collection().bindSource(socket, 'premade.messages');
        // todo move to premade object?
        this.tankStack = new Collection().bindSource(socket, 'game.botStack');

        this.field = new Field(13 * 32, 13 * 32);
        Collection.prototype.bindSource.call(this.field, socket, 'f');

        this.vmRunner = new VmRunner(this);

        var self = this;
        socket.on('logged', function(data) {
            self.currentUser.unserialize(data.user);
        });
        socket.on('joined', function(data) {
            // do not replace this.currentPremade
            self.currentPremade.unserialize(data.premade);
        });
        socket.on('unjoined', function() {
            // do not replace this.currentPremade
            self.currentPremade.unserialize([]);
        });
    }

    Eventable(BcClient.prototype);

    //===== actions ================================================================

    BcClient.prototype.login = function(nick)
    {
        this.socket.emit('login', {
            nick : nick
        });
    };

    BcClient.prototype.setCourse = function(id)
    {
        this.socket.emit('set-course', {
            id: id
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
        this.socket.emit('unjoin');
    };

    BcClient.prototype.startGame = function(level)
    {
        this.socket.emit('start', {
            level: level
        });
    };

    BcClient.prototype.stopGame = function()
    {
        if (this.currentPremade.type == 'createbot') {
            this.socket.emit('stop-game');
        }
    };

    BcClient.prototype.executeCode = function(code)
    {
        if (this.currentPremade.gameRun) {
            this.socket.emit('execute', {
                code: code
            });
            this.vmRunner.executeCode(code);
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

    //===== events =================================================================

    BcClient.prototype.onConnect = function(handler)
    {
        this.socket.on('connect', handler);
    };

    BcClient.prototype.onConnectFail = function(handler)
    {
        this.socket.on('connect_failed', handler).on('error', handler);
    };

    return BcClient;
});