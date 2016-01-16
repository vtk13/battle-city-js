var Collection = require('src/engine/store/collection.js');

function Map()
{
    Collection.call(this);
}

Map.prototype = Object.create(Collection.prototype);
Map.prototype.contructor = Map;

Map.prototype.add = function(item)
{
    if (Collection.prototype.add.call(this, item)) {
        item.x = item.x || 0;
        item.y = item.y || 0;
        item.hw = item.hw || 0;
        item.hh = item.hh || 0;
        return true;
    } else {
        return false;
    }
};

// here may be naive implementation of map

module.exports = Map;
