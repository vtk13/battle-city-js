var assert = require('chai').assert;
var Client = require('src/client/bc-client.js');
var BcServerInterface = require('src/common/server.js');
var Emitter = require('component-emitter');

function DelayingEmitter()
{
    Emitter.apply(this, arguments);
}

DelayingEmitter.prototype = Object.create(Emitter.prototype);
DelayingEmitter.prototype.constructor = DelayingEmitter;

DelayingEmitter.prototype.emit = function() {
    var self = this;
    var args = arguments;
    // emit on next tick, emulate network latency
    setTimeout(function() {
        Emitter.prototype.emit.apply(self, args);
    }, 0);
};

describe('Tank behaviour on field', function() {
    it('Simple single player session', function(done) {
        var socket = new DelayingEmitter();
        var server = new BcServerInterface(socket);
        var client = new Client(socket);
        client.login('vtk', function() {done();});
    });
});
