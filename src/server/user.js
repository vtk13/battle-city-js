
Eventable(User.prototype);

// rename to ServerUser if constructor needed?

User.prototype.serialize = function()
{
    var res = {
        "1": this.id, // todo hack
        id:   this.id,
        nick: this.nick,
        lives: this.lives,
        points: this.points
    };
    if (this.premade) {
        res.premadeId = this.premade.id;
    }
    return res;
};

/**
 * data = {
 *  'users'
 *  'messages'
 *  'premades'
 *  'premade.users'
 *  'premade.messages'
 *  'f' // field.objects
 *  'game.botStack'
 * }
 *
 * @return
 */
User.prototype.sendUpdatesToClient = function()
{
    var lastSync = this.lastSync, chunk, data = {};
    this.lastSync = Date.now();

    data['users'] = registry.users.sync(lastSync);
    if (data['users'].length == 0) delete data['users'];
    else console.log(registry.users.logData);

    data['messages'] = registry.messages.sync(lastSync);
    if (data['messages'].length == 0) delete data['messages'];

    data['premades'] = registry.premades.sync(lastSync);
    if (data['premades'].length == 0) delete data['premades'];

    if (this.premade) {
        data['premade.users'] = this.premade.users.sync(lastSync);
        if (data['premade.users'].length == 0) delete data['premade.users'];

        data['premade.messages'] = this.premade.messages.sync(lastSync);
        if (data['premade.messages'].length == 0) delete data['premade.messages'];

        if (this.premade.game) {
            data['f'] = this.premade.game.field.sync(lastSync);
            if (data['f'].length == 0) delete data['f'];

            data['game.botStack'] = this.premade.game.botStack.sync(lastSync);
            if (data['game.botStack'].length == 0) delete data['game.botStack'];
        }
    }
    if (data['users'] || data['messages'] || data['premades'] ||
            data['premade.users'] || data['premade.messages'] ||
            data['f'] || data['game.botStack']) {
        this.clientMessage('sync', data);
    }
};

User.prototype.control = function(event)
{
    if (this.tank) {
        if (event.move) {
            this.tank.startMove(event.move);
        }
        if (event.stop) {
            this.tank.stopMove();
        }
        if (event.fire) {
            this.tank.fire();
        }
    }
};

User.prototype.say = function(text)
{
    var message = new Message(text);
    message.user = this;
    if (this.premade) {
        this.premade.say(message);
    } else {
        registry.messages.say(message);
    }
};

User.prototype.hit = function()
{
    if (this.game) {
        this.lives -= 1;
        if (this.lives < 0) {
            this.game.unjoin(this);
        } else {
            this.tank.resetPosition();
            this.tank.lives = 1;
        }
        this.emit('change', {type: 'change', object: this});
    }
};

User.prototype.addReward = function(reward)
{
    this.points += reward;
    this.emit('change', {type: 'change', object: this});
};

User.prototype.clientMessage = function(type, data)
{
    if (this.socket) {
        this.socket.emit(type, data);
    } else {
        console.log('Trying to send data to disconnected client.'); // todo bug?
        console.trace();
    }
};

User.prototype.sendToClient = function(data)
{
    if (this.socket) {
        this.socket.json.send(data);
    } else {
        console.log('Trying to send data to disconnected client.'); // todo bug?
        console.trace();
    }
};
