define([
    'chai',
    'src/engine/map/map-tiled.js'
], function(
    chai,
    MapTiled
) {
    var assert = chai.assert;

    describe('MapTiled', function() {
        var map, item1, item2;

        beforeEach(function() {
            map = new MapTiled(100, 100);
            item1 = {x: 10, y: 10, hw: 10, hh: 10};
            item2 = {x: 30, y: 10, hw: 10, hh: 10};
        });

        it('Intersect with all arguments works', function() {
            map.add(item1);
            map.add(item2);
            var res = map.intersects(item1, item1.x + 5, item1.y, item1.hw, item1.hh);
            assert.equal(res[item2.id], item2);
        });

        it('Intersect works', function() {
            map.add(item1);
            map.add(item2);
            var res = map.intersects(item1, item1.x + 5, item1.y);
            assert.equal(res[item2.id], item2);
        });

        it('setXY changes object`s coordinates', function() {
            map.add(item1);
            map.setXY(item1, 20, 30);
            assert.equal(item1.x, 20);
            assert.equal(item1.y, 30);
        });

        it('move without barrier changes object`s coordinates', function() {
            map.add(item1);
            assert.ok(map.move(item1, 20, 30));
            assert.equal(item1.x, 20);
            assert.equal(item1.y, 30);
        });

        it('move on barrier does not change object`s coordinates', function() {
            map.add(item1);
            map.add(item2);
            assert.notOk(map.move(item1, 30, 20));
            assert.equal(item1.x, 10);
            assert.equal(item1.y, 10);
        });

        it('if object has onIntersect move on barrier depends on its result', function() {
            map.add(item1);
            map.add(item2);

            item1.onIntersect = function() { return false; };
            assert.notOk(map.move(item1, 30, 20));
            assert.equal(item1.x, 10);
            assert.equal(item1.y, 10);

            item1.onIntersect = function() { return true; };
            assert.ok(map.move(item1, 30, 20));
            assert.equal(item1.x, 30);
            assert.equal(item1.y, 20);
        });
    });
});
