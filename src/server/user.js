
isArray = Array.isArray;

ServerUser = function ServerUser()
{
    User.call(this, arguments);
    this.collections = {};
    this.updateCollector = {};
};

ServerUser.prototype = new User();

ServerUser._eventTypeMap = {'add': 'a', 'change': 'c', 'remove': 'r'};

Eventable(ServerUser.prototype);

ServerUser.prototype.serialize = function()
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
ServerUser.prototype.sendUpdatesToClient = function()
{
    var lastSync = this.lastSync, data = {}, itemData;
    // events may occur is this milliseconds, so do not record it as synced, and "- 1"
    this.lastSync = Date.now() - 1;

    var collections = 0;
    for (var key in this.updateCollector) {
        data[key] = [];
        for (var i in this.updateCollector[key]) {
            data[key].push(this.updateCollector[key][i]);
            delete this.updateCollector[key][i];
        }
        if (data[key].length == 0) {
            delete data[key];
        } else {
            collections++;
        }
    }
    if (collections) {
        this.clientMessage('sync', data);
    }
};

ServerUser.prototype.control = function(event)
{
    if (this.tank && this.tank.field) {
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

ServerUser.prototype.say = function(text)
{
    var message = new Message(text);
    message.user = this;
    if (this.premade) {
        this.premade.say(message);
    } else {
        registry.messages.say(message);
    }
};

ServerUser.prototype.hit = function()
{
    if (this.premade) {
        this.lives -= 1;
        if (this.lives < 0) {
            this.tank.field.remove(this.tank);
        } else {
            this.tank.lives = 1;
            this.tank.resetPosition();
        }
        this.emit('change', {type: 'change', object: this});
    }
};

ServerUser.prototype.addReward = function(reward)
{
    this.points += reward;
    this.emit('change', {type: 'change', object: this});
};

ServerUser.prototype.clientMessage = function(type, data)
{
    if (this.socket) {
        this.socket.emit(type, data);
    } else {
        console.log('Trying to send data to disconnected client.'); // todo bug?
//        console.trace();
    }
};

ServerUser.prototype.sendToClient = function(data)
{
    if (this.socket) {
        this.socket.json.send(data);
    } else {
        console.log('Trying to send data to disconnected client.'); // todo bug?
//        console.trace();
    }
};

ServerUser.prototype.onCollectionUpdate = function(syncKey, item, type /*, fields*/)
{
    var data = item.serialize();
    this.updateCollector[syncKey][item.id] = [ServerUser._eventTypeMap[type], data];
};

/**
 * @param collection
 * @param syncKey ключ, по которому клиент узнает к какой группе относятся объекты
 */
ServerUser.prototype.watchCollection = function(collection, syncKey)
{
    this.unwatchCollection(syncKey);
    // суда будут складываться объновления объектов
    this.updateCollector[syncKey] = [];
    var user = this;
    var cb = function(item, type) {
        user.onCollectionUpdate(syncKey, item, type);
    };
    // подписываемся на обновления
    collection.on('update', cb);
    // запоминаем callback, чтобы при отключении от группы, можно было удалить обработчик
    this.collections[syncKey] = {'callback': cb, 'collection': collection};
    // отправляем клиенту все объекты группы, как вновь созданные
    collection.traversal(function(item){
        this.onCollectionUpdate(syncKey, item, 'add');
    }, this);
};

ServerUser.prototype.unwatchCollection = function(syncKey)
{
    if (this.collections[syncKey]) {
        // удаляем обработчик
        this.collections[syncKey].collection.removeListener('update', this.collections[syncKey].callback);
        // сообщаем клиенту, чтобы он удалил у себя эту группу
        this.clientMessage('clearCollection', syncKey);
        delete this.collections[syncKey];
        delete this.updateCollector[syncKey];
    }
};

ServerUser.prototype.unwatchAll = function()
{
    for (var syncKey in this.collections) {
        this.unwatchCollection(syncKey);
    }
};