var Bullet = require('src/battle-city/objects/bullet.js');
var Tank = require('src/battle-city/objects/tank.js');
var bot = require('src/battle-city/objects/tankbot.js');
var wall = require('src/battle-city/objects/wall.js');
var bonus = require('src/battle-city/objects/bonus.js');
var Water = require('src/battle-city/objects/water.js');
var Trees = require('src/battle-city/objects/trees.js');
var Ice = require('src/battle-city/objects/ice.js');
var Delimiter = require('src/battle-city/objects/delimiter.js');
var Base = require('src/battle-city/objects/base.js');
var User = require('src/common/user.js');
var Premade = require('src/common/premade.js');
var Message = require('src/common/message.js');
var Collection = require('src/engine/store/collection.js');
var registry = require('src/common/registry.js');
var OdbProxy = require('src/engine/store/odb_proxy.js');

var unserializeTypeMatches = {
    1: Bullet,
    2: Tank,
    3: bot.TankBot,
    4: bot.HeavyTankBot,
    5: bot.FastBulletTankBot,
    6: bot.FastTankBot,
    7: wall.Wall,
    8: wall.SteelWall,
    9: bonus.BonusTimer,
    10: bonus.BonusShovel,
    11: bonus.BonusStar,
    12: bonus.BonusHelmet,
    13: bonus.BonusLive,
    14: bonus.BonusGrenade,
    15: Water,
    16: Trees,
    17: Ice,
    18: Delimiter,
    19: Base,
    20: User,
    21: Premade,
    22: Message
};

var serializeTypeMatches = {};
for (var i in unserializeTypeMatches) {
    var constructorName = unserializeTypeMatches[i].name;
    serializeTypeMatches[constructorName] = i;
}

/* sample
AbstractGameObject.prototype.serialize = function()
{
    // zero element is always type, first - id
    return [
        serializeTypeMatches['AbstractGameObject'],
        this.id
        // ...
    ];
};

//sample
AbstractGameObject.prototype.unserialize = function(data)
{
    this.id = data[1];
    // ...
};
*/

Base.prototype.serialize = function()
{
    return [
        serializeTypeMatches[this.constructor.name],
        this.id,
        this.x,
        this.y,
        this.shootDown
    ];
    // z is constant
};

Base.prototype.unserialize = function(data)
{
    this.id = data[1];
    if (this.field) {
        this.field.setXY(this, data[2], data[3]);
    } else {
        // first unserialize, before adding to field -> may set x and y directly
        this.x = data[2];
        this.y = data[3];
    }
    this.shootDown = data[4];
};

bonus.Bonus.prototype.serialize = function()
{
    return [
        serializeTypeMatches[this.constructor.name],
        this.id,
        this.x,
        this.y
    ];
    // z is constant
};

bonus.Bonus.prototype.unserialize = function(data)
{
    this.id = data[1];
    if (this.field) {
        this.field.setXY(this, data[2], data[3]);
    } else {
        // first unserialize, before adding to field -> may set x and y directly
        this.x = data[2];
        this.y = data[3];
    }
};

Bullet.prototype.serialize = function()
{
    return [
        serializeTypeMatches[this.constructor.name], // 0
        this.id, // 1
        this.x, // 2
        this.y, // 3
        this.speedX, // 4
        this.speedY, // 5
        this.finalX, // 6 todo remove
        this.finalY // 7 todo remove
    ];
};

Bullet.prototype.unserialize = function(data)
{
    this.id = data[1];
    if (this.field) {
        this.field.setXY(this, data[2], data[3]);
    } else {
        // first unserialize, before adding to field -> may set x and y directly
        this.x = data[2];
        this.y = data[3];
    }
    this.setSpeedX(data[4]);
    this.setSpeedY(data[5]);
    this.finalX = data[6];
    this.finalY = data[7];
    this.setDirectionImage();
};

Delimiter.prototype.serialize = function()
{
    return [
        serializeTypeMatches[this.constructor.name], // 0
        this.id, // 1
        this.x,
        this.y,
        this.hw,
        this.hh
    ];
};

Delimiter.prototype.unserialize = function(data)
{
    this.id = data[1];
    if (this.field) {
        this.field.setXY(this, data[2], data[3]);
    } else {
        // first unserialize, before adding to field -> may set x and y directly
        this.x = data[2];
        this.y = data[3];
    }
    this.hw = data[4];
    this.hh = data[5];
};

Ice.prototype.serialize = function()
{
    return [
        serializeTypeMatches[this.constructor.name], // 0
        this.id, // 1
        this.x,
        this.y
    ];
    // z is constant
};

Ice.prototype.unserialize = function(data)
{
    this.id = data[1];
    if (this.field) {
        this.field.setXY(this, data[2], data[3]);
    } else {
        // first unserialize, before adding to field -> may set x and y directly
        this.x = data[2];
        this.y = data[3];
    }
};

Tank.prototype.serialize = function()
{
    return [
        serializeTypeMatches[this.constructor.name], // 0
        this.id, // 1
        this.x, // 2
        this.y, // 3
        this.speedX, // 4
        this.speedY, // 5
        this.bonus, // 6
        Math.round(this.armoredTimer), // 7
        Math.round(this.birthTimer), // 8
        this.colorCode // 9
    ];
};

Tank.prototype.unserialize = function(data)
{
    this.id = data[1];
    if (this.field) {
        this.field.setXY(this, data[2], data[3]);
    } else {
        // first unserialize, before adding to field -> may set x and y directly
        this.x = data[2];
        this.y = data[3];
    }
    this.setSpeedX(data[4]);
    this.setSpeedY(data[5]);
    this.bonus = data[6];
    this.armoredTimer = data[7];
    this.birthTimer = data[8];
    this.colorCode = data[9];
};

Trees.prototype.serialize = function()
{
    return [
        serializeTypeMatches[this.constructor.name], // 0
        this.id, // 1
        this.x,
        this.y
    ];
    // z is constant
};

Trees.prototype.unserialize = function(data)
{
    this.id = data[1];
    if (this.field) {
        this.field.setXY(this, data[2], data[3]);
    } else {
        // first unserialize, before adding to field -> may set x and y directly
        this.x = data[2];
        this.y = data[3];
    }
};

wall.Wall.prototype.serialize = function()
{
    return [
        serializeTypeMatches[this.constructor.name], // 0
        this.id, // 1
        this.x,
        this.y
    ];
    // z is constant
};

wall.Wall.prototype.unserialize = function(data)
{
    this.id = data[1];
    if (this.field) {
        this.field.setXY(this, data[2], data[3]);
    } else {
        // first unserialize, before adding to field -> may set x and y directly
        this.x = data[2];
        this.y = data[3];
    }
};

Water.prototype.serialize = function()
{
    return [
            serializeTypeMatches[this.constructor.name], // 0
            this.id, // 1
            this.x,
            this.y
        ];
        // z is constant
};

Water.prototype.unserialize = function(data)
{
    this.id = data[1];
    if (this.field) {
        this.field.setXY(this, data[2], data[3]);
    } else {
        // first unserialize, before adding to field -> may set x and y directly
        this.x = data[2];
        this.y = data[3];
    }
};

Message.prototype.serialize = function()
{
    return [
        serializeTypeMatches[this.constructor.name] // 0
      , this.id // 1
      , this.time // 2
      , this.user.id // 3
      , this.user.nick // 4
      , this.text // 5
    ];
};

Message.prototype.unserialize = function(data)
{
    this.id     = data[1];
    this.time   = data[2];
    this.userId = data[3];
    this.nick   = data[4];
    this.text   = data[5];
};

Premade.prototype.serialize = function()
{
    return [
        serializeTypeMatches[this.constructor.name], // 0
        this.id, // 1
        this.name, // 2
        this.level, // 3
        this.type, // 4
        this.locked, // 5
        this.userCount, // 6
        this.running // 7
    ];
};

Premade.prototype.unserialize = function(data)
{
    this.id         = data[1];
    this.name       = data[2];
    this.level      = data[3];
    this.type       = data[4];
    this.locked     = data[5];
    this.userCount  = data[6];
    this.running    = data[7];
};

User.prototype.serialize = function()
{
    return [
        serializeTypeMatches[this.constructor.name] // 0
      , this.id // 1
      , this.nick // 2
      , this.lives // 3
      , this.points // 4
      , this.clan ? this.clan.n : 0 // 5
      , this.premade ? this.premade.id : 0 // 6
      , this.positionId // 7
      , this.tank ? this.tank.id : 0 // 8
    ];
};

User.prototype.unserialize = function(data)
{
    var self = this;
    this.id     = data[1];
    this.nick   = data[2];
    this.lives  = data[3];
    this.points = data[4];
    this.clan   = data[5];
    if (data[6]) {
        registry.odb.fetch(data[6], function(premade) {
            self.premade = premade;
        });
    } else {
        this.premade = null;
    }
    this.positionId = data[7];
    this.tankId     = data[8];
};


function serialize(object)
{
    return object.serialize();
}

function unserialize(object, data)
{
    var type = unserializeTypeMatches[data[0/*type*/]];
    object = object || new type();
    // todo бывает приходит событие change объекта, который уже удален и на его месте уже анимашка
    if (object.unserialize) {
        object.unserialize(data);
    } else {
        console.log(object.constructor.name + ' has no method unserialize');
    }
    return object;
}

OdbProxy.prototype.updateWith = function(events) {
    for (var i in events) {
        var eventType = events[i][0/*type*/];
        var eventData = events[i][1/*data*/];
        var id = parseInt(eventData[1/*id*/]);
        switch (eventType) {
        case 'r'/*remove*/:
            if (obj = registry.odb.fetch(id)) {
                unserialize(obj, eventData);// for bullets finalX and finalY
                registry.odb.free(obj);
            }
            break;
            case 'a'/*add*/:
            case 'c'/*change*/:
                var obj = registry.odb.fetch(id);
                if (obj) {
                    unserialize(obj, eventData);
//                        registry.odb.emit('change', obj);
                } else {
                    obj = unserialize(undefined, eventData);
                    registry.odb.add(obj);
                }
                break;
        }
    }
};

Collection.prototype.updateWith = function(events)
{
    for (var i in events) {
        var eventType = events[i][0/*type*/];
        var eventData = events[i][1/*data*/];
        var id = parseInt(eventData[1/*id*/]);
        switch (eventType) {
            case 'r'/*remove*/:
                if (obj = this.items[id]) {
                    unserialize(obj, eventData);// for bullets finalX and finalY
                    this.remove(obj);
                }
                break;
            case 'a'/*add*/:
            case 'c'/*change*/:
                var obj = this.items[id];
                if (obj) {
                    unserialize(obj, eventData);
                    this.emit('change', obj);
                } else {
                    obj = unserialize(undefined, eventData);
                    this.add(obj);
                }
                break;
        }
    }
};

Collection.prototype.bindSource = function(source, key)
{
    var self = this;
    source.on('sync', function(data) {
        if (data[key]) {
            // todo updateWith defined in serialization.js
            self.updateWith(data[key]);
        }
    });
    source.on('clearCollection', function(data) {
        if (data == key) {
            self.clear();
        }
    });
    return this;
};

module.exports = {
    serialize: serialize,
    unserialize: unserialize
};
