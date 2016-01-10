var assert = require('chai').assert;
var Field = require('src/battle-city/field.js');
var Tank = require('src/battle-city/objects/tank.js');

describe('Tank behaviour on field', function() {
    var field, tank;

    beforeEach(function() {
        field = new Field(100, 100);
        tank = new Tank(32, 32);
    });

    it('field.step moves tanks', function() {
        field.add(tank);
        tank.birthTimer = 0;
        tank.startMove();

        field.step();
        assert.deepEqual([tank.x, tank.y], [32, 30]);
        field.step();
        assert.deepEqual([tank.x, tank.y], [32, 28]);

        tank.turn('left');
        assert.deepEqual([tank.x, tank.y], [32, 32]); // turn align tank according game grid

        field.step();
        assert.deepEqual([tank.x, tank.y], [30, 32]);
        field.step();
        assert.deepEqual([tank.x, tank.y], [28, 32]);
    });
});
