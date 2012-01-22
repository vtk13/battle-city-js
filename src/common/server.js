
var path = require("path");
var fs = require("fs");

/**
 * This object is an interface for "server-side" variables. All access to them
 * should be done here.
 *
 * @param socket EventEmitter
 */
BcServerInterface = function BcServerInterface(socket)
{
    this.user = null;
    this.socket = socket;
    socket.on('login',      this.onLogin.bind(this));
    socket.on('set-course', this.onSetCourse.bind(this));
    socket.on('join',       this.onJoin.bind(this));
    socket.on('unjoin',     this.onUnjoin.bind(this));
    socket.on('execute',    this.onExecute.bind(this));
    socket.on('start',      this.onStart.bind(this));
    socket.on('stop-game',  this.onStopGame.bind(this));
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
};

BcServerInterface.prototype.onLogin = function(event)
{
    if (this.user == null && event.nick) {
        var nick = event.nick && event.nick.substr(0,20);
        var nickAllowed = true;
        registry.users.traversal(function(user){
            if (nick == user.nick) {
                nickAllowed = false;
            }
        });
        if (nickAllowed) {
            this.user = new ServerUser(registry.courses.get(1));
            this.user.lastSync = 0;
            this.user.socket = this.socket;
            this.user.nick = nick;
            registry.users.add(this.user);
            this.user.updateIntervalId = setInterval(this.user.sendUpdatesToClient.bind(this.user), 50);
            this.socket.emit('logged', {
                user: this.user.serialize()
            });
            this.user.watchCollection(registry.users, 'users');
            this.user.watchCollection(registry.premades, 'premades');
            this.user.watchCollection(registry.messages, 'messages');
            this.user.watchCollection(registry.courses, 'courses');
            console.log(new Date().toLocaleTimeString() + ': user ' + nick + ' connected');
        } else {
            this.socket.emit('nickNotAllowed');
        }
    }
};

BcServerInterface.prototype.onSetCourse = function(event){
    var courseId = event.id;
    var course = registry.courses.get(courseId);
    if (this.user && course) {
        this.user.setCurrentCourse(course);
    }
    // todo why user.setCurrentCourse() is not enough?
    this.socket.emit('course-changed', course.id);
};

BcServerInterface.prototype.onJoin = function(event){
    try {
        registry.premades.join(event, this.user);
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

BcServerInterface.prototype.onUnjoin = function(){
    if (this.user.premade) {
        console.log(new Date().toLocaleTimeString() + ': user ' + this.user.nick
                + ' unjoin premade ' + this.user.premade.name);
        this.user.premade.unjoin(this.user);
        this.socket.emit('unjoined');
    }
};

BcServerInterface.prototype.onExecute = function(event){
    var userFolder = path.join(process.cwd(), 'bots/' + this.user.id);
    try {
        fs.mkdirSync(userFolder, 0777);
    } catch (ex) {/*ignore EEXIST*/}
    var tries = fs.readdirSync(userFolder);
    var botSourceFile = path.join(userFolder, 'try' + tries.length + '.pas');
    fs.writeFileSync(botSourceFile, event.code);
    this.socket.emit('execute', {
        script: botSourceFile.substr(process.cwd().length)
    });
};

BcServerInterface.prototype.onStart = function(event){
    if (this.user.premade && !this.user.premade.game) {
        if (event.level && this.user.premade.level != event.level) {
            this.user.premade.level = event.level;
            this.user.premade.emit('change');
        }
        this.user.premade.startGame();
        console.log(new Date().toLocaleTimeString() + ': user ' + this.user.nick
                + ' starts game ' + this.user.premade.name + ', level ' + this.user.premade.level);
    }
};

BcServerInterface.prototype.onStopGame = function(){
    if (this.user.premade) {
        this.user.premade.gameOver();
    }
};

BcServerInterface.prototype.onControl = function(event) {
    if (this.user) {
        try {
            this.user.control(event);
        } catch (ex) {
            console.log(ex.stack);
        }
    }
};

BcServerInterface.prototype.onSay = function(event) {
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

BcServerInterface.prototype.onDisconnect = function(event) {
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
        registry.users.remove(this.user);
    } else {
        console.log(new Date().toLocaleTimeString() + ': anonymous disconnected ('
                + connections , ' total)');
    }
};

