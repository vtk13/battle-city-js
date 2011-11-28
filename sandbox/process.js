var util    = require('util');
var vm      = require('vm');
var fs      = require("fs");
var sandbox = {
};

fs.readFile('untrusted.js', 'utf8', function(err, file) {
    if(!err) {
//        try {
            vm.runInNewContext(file, sandbox);
//        } catch (ex) {
//            console.log(ex, ex.message);
//        }
        console.log(sandbox);
    }
});
