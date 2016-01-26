var Collection = require('src/engine/store/collection.js');
var Premade = require('src/common/premade.js');

module.exports = PremadeList;

function PremadeList()
{
    Collection.call(this);

    this.byName = {};
}

PremadeList.prototype = Object.create(Collection.prototype);
PremadeList.prototype.constructor = PremadeList;

PremadeList.prototype.add = function(item)
{
    if (Collection.prototype.add.call(this, item)) {
        this.byName[item.name] = item;
        var self = this;
        item.once('empty', function() {
            self.remove(item);
        });
        return true;
    } else {
        return false;
    }
};

PremadeList.prototype.remove = function(item)
{
    if (Collection.prototype.remove.call(this, item)) {
        delete this.byName[item.name];
        return true;
    } else {
        return false;
    }
};

PremadeList.prototype.join = function(event, user)
{
    var gameName = event.name && event.name.substr(0,20);
    if (!user.premade) {
        var premade = this.byName[gameName];
        if (!premade) {
            premade = new Premade(gameName);
            this.add(premade);
        }
        premade.join(user);
    } else {
        throw {message: "User already in premade - " + user.premade.id + " (bug?)"};
    }
};
