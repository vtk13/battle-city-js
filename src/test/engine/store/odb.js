var assert = require('chai').assert;
var Odb = require('src/engine/store/odb.js');

describe('Global object registry', function () {
    var odb;
    beforeEach(function() {
        odb = new Odb();
    });

    it('Adding item should generate id for it', function() {
        var a = {};
        odb.add(a);
        assert.isNumber(a.id);
    });

    it('Creating item should also generate id for it', function() {
        function A(value) {
            this.value = value;
        }
        var a = odb.create(A, [100]);

        assert.instanceOf(a, A);
        assert.isNumber(a.id);
        assert.equal(a.value, 100);
    });

    it('Fetch item return added object', function() {
        var a = {};
        odb.add(a);
        assert.strictEqual(odb.fetch(a.id), a);
    });

    it('Free removes item from list', function() {
        var a = {};
        odb.add(a);
        assert.ok(odb.fetch(a.id));
        odb.free(a);
        assert.notOk(odb.fetch(a.id));
    });
});
