define([
    'path', 'fs',
    'src/server/user.js',
    'src/common/registry.js'
], function(
    path, fs,
    ServerUser,
    registry
) {
    /**
     * This object is an interface for "server-side" variables. All access to them
     * should be done here.
     *
     * @param socket EventEmitter
     */
    function BcServerInterface(socket)
    {
        this.user = null;
        this.socket = socket;
        socket.on('login',      this.onLogin.bind(this));
        socket.on('join',       this.onJoin.bind(this));
        socket.on('unjoin',     this.onUnjoin.bind(this));
        socket.on('start',      this.onStart.bind(this));
        socket.on('control',    this.onControl.bind(this));
        socket.on('say',        this.onSay.bind(this));
        socket.on('disconnect', this.onDisconnect.bind(this));

        try {
            var connections = 0;
            for (var i in socket.manager.connected) {
                connections++;
            }
        } catch(e) {}
        console.log(new Date().toLocaleTimeString() + ': Connection accepted (' + connections , ' total)');
    }

    BcServerInterface.prototype.onLogin = function(event)
    {
        if (this.user == null && event.nick) {
            var nick = event.nick && event.nick.substr(0,20);
            var nickAllowed = true;
            oldGlobalRegistry.users.traversal(function(user){
                if (nick == user.nick) {
                    nickAllowed = false;
                }
            });
            if (nickAllowed) {
                this.user = registry.odb.create(ServerUser);
                this.user.lastSync = 0;
                this.user.socket = this.socket;
                this.user.nick = nick;
                oldGlobalRegistry.users.add(this.user);
                this.user.updateIntervalId = setInterval(this.user.sendUpdatesToClient.bind(this.user), 50);
                this.socket.emit('logged', {
                    user: this.user.serialize()
                });
                this.user.watchCollection(oldGlobalRegistry.users, 'users');
                this.user.watchCollection(oldGlobalRegistry.premades, 'premades');
                this.user.watchCollection(oldGlobalRegistry.messages, 'messages');
                console.log(new Date().toLocaleTimeString() + ': user ' + nick + ' connected');
            } else {
                this.socket.emit('nickNotAllowed');
            }
        }
    };

    BcServerInterface.prototype.onJoin = function(event)
    {
        try {
            oldGlobalRegistry.premades.join(event, this.user);
            this.socket.emit('joined', {
                // user not likely synced this premade yet
                premade: this.user.premade.serialize()
            });

            console.log(new Date().toLocaleTimeString() + ': user ' + this.user.nick
                    + ' join premade ' + this.user.premade.name + ' (' + event.gameType + ')');
        } catch (ex) {
            console.log(ex.message, ex.stack);
            this.socket.emit('user-message', {
                message: ex.message
            });
        }
    };

    BcServerInterface.prototype.onUnjoin = function()
    {
        if (this.user.premade) {
            console.log(new Date().toLocaleTimeString() + ': user ' + this.user.nick
                    + ' unjoin premade ' + this.user.premade.name);
            this.user.premade.unjoin(this.user);
            this.socket.emit('unjoined');
        }
    };

    BcServerInterface.prototype.onStart = function(event)
    {
        if (this.user.premade && !this.user.premade.game) {
            if (event.level && this.user.premade.level != event.level) {
                this.user.premade.level = event.level;
                this.user.premade.emit('change');
            }
            if (event.local) {
                this.user.premade.lock();
                console.log(new Date().toLocaleTimeString() + ': user ' + this.user.nick
                        + ' starts LOCAL game ' + this.user.premade.name + ', level ' + this.user.premade.level);
            } else {
                this.user.premade.startGame();
                console.log(new Date().toLocaleTimeString() + ': user ' + this.user.nick
                        + ' starts game ' + this.user.premade.name + ', level ' + this.user.premade.level);
            }
        }
    };

    BcServerInterface.prototype.onControl = function(event)
    {
        if (this.user) {
            try {
                this.user.control(event);
            } catch (ex) {
                console.log(ex.stack);
            }
        }
    };

    BcServerInterface.prototype.onSay = function(event)
    {
        var message = event.text;
        if (typeof message == 'string') {
            message = message.substr(0, 200);
        }
        if (this.user.say(message)) {
            console.log(new Date().toLocaleTimeString() + ': user ' + this.user.nick + ' say ' + message);
        } else {
            this.user.clientMessage('doNotFlood');
        }
    };

    BcServerInterface.prototype.onDisconnect = function(event)
    {
        try {
            var connections = -1;
            for (var i in this.socket.manager.connected) {
                connections++;
            }
        } catch(e) {}
        if (this.user) {
            console.log(new Date().toLocaleTimeString() + ': user ' + this.user.nick
                    + ' disconnected (' + connections , ' total)');
            clearInterval(this.user.updateIntervalId);
            this.user.unwatchAll();
            this.user.socket = null;
            if (this.user.premade) {
                this.user.premade.unjoin(this.user);
            }
            oldGlobalRegistry.users.remove(this.user);
        } else {
            console.log(new Date().toLocaleTimeString() + ': anonymous disconnected ('
                    + connections , ' total)');
        }
    };

    return BcServerInterface;
});