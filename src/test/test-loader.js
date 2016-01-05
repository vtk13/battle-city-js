var requirejs = require("requirejs");

requirejs([
    'src/test/map/map.js',
    'src/test/store/odb.js',
    'src/test/store/collection.js'
], function() {
    run();
});
