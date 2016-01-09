var Collection = require('src/engine/store/collection.js');

function Map()
{
    Collection.call(this);
}

Map.prototype = Object.create(Collection.prototype);
Map.prototype.contructor = Map;

// here may be naive implementation of map

module.exports = Map;
