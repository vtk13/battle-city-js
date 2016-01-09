var Collection = require('src/engine/store/collection.js');
var Premade = require('src/common/premade.js');
var odb = require('src/engine/store/odb.js');

function PremadeList()
{
    Collection.call(this);
}

PremadeList.prototype = Object.create(Collection.prototype);
PremadeList.prototype.constructor = PremadeList;

PremadeList.prototype.join = function(event, user)
{
    var gameName = event.name && event.name.substr(0,20);
    if (!user.premade) {
        var premade;
        for (var i in this.items) {
            if (this.items[i].name == gameName) {
                premade = this.items[i];
                break;
            }
        }
        if (!premade) {
            if (this.length >= 100) { // games limit
                throw {message: "Не получается создать игру. Достигнут максимум одновременных игр на сервере."};
            } else {
                premade = odb.create(Premade, [gameName, event.gameType]);
                this.add(premade);
            }
        }
        premade.join(user);
    } else {
        throw {message: "User already in premade - " + user.premade.id + " (bug?)"};
    }
};

module.exports = PremadeList;
