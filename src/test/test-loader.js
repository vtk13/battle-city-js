var requirejs = require("requirejs");

requirejs([
    'src/test/engine/map/map-tiled.js',
    'src/test/engine/store/odb.js',
    'src/test/engine/store/collection.js'
], function() {
    run();
});
