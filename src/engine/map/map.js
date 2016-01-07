define([
    'src/engine/store/collection.js'
], function(
    Collection
) {
    function Map()
    {
        Collection.call(this);
    }

    Map.prototype = Object.create(Collection.prototype);
    Map.prototype.contructor = Map;

    // here may be naive implementation of map

    return Map;
});
