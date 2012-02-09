define(['src/battle-city/objects/bullet.js',
        'src/battle-city/objects/tank.js',
        'src/battle-city/objects/tankbot.js',
        'src/battle-city/objects/wall.js',
        'src/battle-city/objects/bonus.js',
        'src/battle-city/objects/water.js',
        'src/battle-city/objects/trees.js',
        'src/battle-city/objects/ice.js',
        'src/battle-city/objects/delimiter.js',
        'src/battle-city/objects/base.js',
        'src/battle-city/objects/checkpoint.js',
        'src/server/user.js',
        'src/common/user.js',
        'src/common/premade.js',
        'src/common/message.js',
        'src/battle-city/goals.js',
        'src/edu/course.js',
        'src/edu/exercise.js',
        'src/common/list.js',
        'src/battle-city/field.js'], function(Bullet, Tank, bot, wall, bonus, Water,
                Trees, Ice, Delimiter, Base, Checkpoint, ServerUser, User,
                Premade, Message, goal, course, Exercise, TList, Field) {
    var serializeTypeMatches = {
        'Bullet'            : 1,
        'Tank'              : 2,
        'TankBot'           : 3,
        'HeavyTankBot'      : 4,
        'FastBulletTankBot' : 5,
        'FastTankBot'       : 6,
        'Wall'              : 7,
        'SteelWall'         : 8,
        'BonusTimer'        : 9,
        'BonusShovel'       : 10,
        'BonusStar'         : 11,
        'BonusHelmet'       : 12,
        'BonusLive'         : 13,
        'BonusGrenade'      : 14,
        'Water'             : 15,
        'Trees'             : 16,
        'Ice'               : 17,
        'Delimiter'         : 18,
        'Base'              : 19,
        'ServerUser'        : 20,
        'Premade'           : 21,
        'Message'           : 22,
        'Checkpoint'        : 23,
        'GoalCheckPoint'    : 24,
        'Course'            : 25,
        'Exercise'          : 26
    };

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
        22: Message,
        23: Checkpoint,
        24: goal.GoalCheckPoint,
        25: course.Course,
        26: Exercise
    };

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
            serializeTypeMatches['Base'],
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
            serializeTypeMatches['Bullet'], // 0
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

    Checkpoint.prototype.serialize = function()
    {
        return [
            serializeTypeMatches[this.constructor.name], // 0
            this.id, // 1
            this.x, // 2
            this.y // 3
        ];
        // z is constant
    };

    Checkpoint.prototype.unserialize = function(data)
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

    Delimiter.prototype.serialize = function()
    {
        return [
            serializeTypeMatches['Delimiter'], // 0
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
            serializeTypeMatches['Ice'], // 0
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
            this.clan.n // 9
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
        this.clanN = data[9];
    };

    Trees.prototype.serialize = function()
    {
        return [
            serializeTypeMatches['Trees'], // 0
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
                serializeTypeMatches['Water'], // 0
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

    goal.GoalCheckPoint.prototype.serialize = function()
    {
        return [
            serializeTypeMatches[this.constructor.name], // 0
            this.id, // 1
            this.status, // 2
            this.checkpoint.x, // 3
            this.checkpoint.y // 4
        ];
    };

    goal.GoalCheckPoint.prototype.unserialize = function(data)
    {
        this.id = data[1];
        this.status = data[2];
        this.checkpoint = new Checkpoint(data[3], data[4]);
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
            this.gameRun || this.game && this.game.running // 7 todo avoid this kind of code
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
        this.gameRun    = data[7];
    };

    course.Course.prototype.serialize = function()
    {
        return [
            serializeTypeMatches[this.constructor.name], // 0
            this.id, // 1
            this.name // 2
        ];
        // z is constant
    };

    course.Course.prototype.unserialize = function(data)
    {
        this.id = data[1];
        this.name = data[2];
    };

    ServerUser.prototype.serialize = function()
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
          , this.currentCourse ? this.currentCourse.id : 0 // 9
        ];
    };

    /**
     * @todo hack for BcClient.onUserChange()
     * @param data
     * @return
     */
    User.prototype.serialize = function()
    {
        var res = [];
        res[1] = this.id;
        res[2] = this.nick;
        res[3] = this.lives;
        res[4] = this.points;
        res[5] = this.clan;
        res[6] = this.premadeId;
        res[7] = this.positionId;
        res[8] = this.tankId;
        res[9] = this.currentCourseId;
        return res;
    };

    User.prototype.unserialize = function(data)
    {
        this.id     = data[1];
        this.nick   = data[2];
        this.lives  = data[3];
        this.points = data[4];
        this.clan   = data[5];
        this.premadeId  = data[6];
        this.positionId = data[7];
        this.tankId     = data[8];
        this.currentCourseId    = data[9];
    };

    Exercise.prototype.serialize = function()
    {
        return [
            serializeTypeMatches[this.constructor.name], // 0
            this.id, // 1
            this.name, // 2
            this.level // 3
        ];
        // z is constant
    };

    Exercise.prototype.unserialize = function(data)
    {
        this.id = data[1];
        this.name = data[2];
        this.level = data[3];
    };

    function serialize(object)
    {
        return object.serialize();
    };

    function unserialize(object, data)
    {
        if (object) {
            object.unserialize(data);
        } else {
            var type = unserializeTypeMatches[data[0/*type*/]];
            object = new type();
            object.unserialize(data);
        }
        return object;
    };

    TList.prototype.updateWith = function(events){
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
    };    /**
     * todo almost copy of TList.prototype.updateWith
     */
    Field.prototype.updateWith = function(events)
    {
        for (var i in events) {
            var eventType = events[i][0/*type*/];
            var eventData = events[i][1/*data*/];
            var type = unserializeTypeMatches[eventData[0/*type*/]];
            var id = parseInt(eventData[1/*id*/]);
            switch (eventType) {
            case 'r'/*remove*/:
                if (obj = this.objects.get(id)) {
                    unserialize(obj, eventData);// for bullets finalX and finalY
                    this.remove(obj);
                }
                break;
                case 'a'/*add*/:
                case 'c'/*change*/:
                    var obj = this.objects.get(id);
                    if (obj) {
                        unserialize(obj, eventData);
                    } else {
                        obj = unserialize(undefined, eventData);
                        this.add(obj);
                    }
                    break;
            }
        }
    };

    return {
        serialize: serialize,
        unserialize: unserialize
    };
});