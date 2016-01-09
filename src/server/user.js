define([
    'src/common/user.js',
    'src/common/message.js'
], function(
    User,
    Message
) {
    function ServerUser()
    {
        User.call(this);
        this.collections = {};
        this.updateCollector = {};
        this.messages = 0;
        this.countMessageFrom = Date.now();
    }

    ServerUser.maxMessages = 10; // per minute
    ServerUser._eventTypeMap = {'add': 'a', 'change': 'c', 'remove': 'r'};

    ServerUser.prototype = Object.create(User.prototype);
    ServerUser.prototype.constructor = ServerUser;

    ServerUser.prototype.sendUpdatesToClient = function()
    {
        if ((this.countMessageFrom + 60*1000) < Date.now()) {
            this.countMessageFrom = Date.now();
            this.messages = 0;
        }

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
        // if have tank and tank is on the field
        if (this.tank && this.tank.field) {
            if (event.turn) {
                this.tank.turn(event.turn);
            }
            if (event.startMove) {
                this.tank.startMove();
            }
            if (event.stopMove) {
                this.tank.stopMove();
            }
            if (event.fire) {
                this.tank.fire();
            }
        }
    };

    ServerUser.prototype.say = function(text)
    {
        if (this.messages < ServerUser.maxMessages) {
            var message = new Message(text);
            message.user = this;
            if (this.premade) {
                this.premade.say(message);
            } else {
                oldGlobalRegistry.messages.say(message);
            }
            this.messages++;
            return true;
        } else {
            return false;
        }
    };

    ServerUser.prototype.addReward = function(reward)
    {
        this.points += reward;
        this.emit('change');
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
        // сюда будут складываться объновления объектов
        this.updateCollector[syncKey] = [];
        var user = this;
        var addCallback = function(item) {
            user.onCollectionUpdate(syncKey, item, 'add');
        };
        var changeCallback = function(item) {
            user.onCollectionUpdate(syncKey, item, 'change');
        };
        var removeCallback = function(item) {
            user.onCollectionUpdate(syncKey, item, 'remove');
        };
        // подписываемся на обновления
        collection.on('add', addCallback);
        collection.on('change', changeCallback);
        collection.on('remove', removeCallback);
        // запоминаем callback, чтобы при отключении от группы, можно было удалить обработчик
        this.collections[syncKey] = {
            'addCallback': addCallback,
            'changeCallback': changeCallback,
            'removeCallback': removeCallback,
            'collection': collection
        };
        // отправляем клиенту все объекты группы, как вновь созданные
        collection.traversal(function(item){
            this.onCollectionUpdate(syncKey, item, 'add');
        }, this);
    };

    ServerUser.prototype.unwatchCollection = function(syncKey)
    {
        if (this.collections[syncKey]) {
            // удаляем обработчик
            this.collections[syncKey].collection.removeListener('add', this.collections[syncKey].addCallback);
            this.collections[syncKey].collection.removeListener('change', this.collections[syncKey].changeCallback);
            this.collections[syncKey].collection.removeListener('remove', this.collections[syncKey].removeCallback);
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

    return ServerUser;
});
