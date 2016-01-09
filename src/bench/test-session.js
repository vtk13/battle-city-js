var io = require('socket.io-client');
var assert = require('assert');
var BcClient = require('src/client/bc-client.js');
var registry = require('src/common/registry.js');
var OdbProxy = require('src/engine/store/odb_proxy.js');

return;

describe('IN ORDER TO play single player mode AS a player I NEED TO', function () {
    this.timeout(0);
    var bcClient = null;
    var name = 'test' + Date.now();
    before(function(done) {
        var host = 'http://localhost:8124';
        //var host = 'http://ws.bc.vtkd.ru';
        var socket = io(host, {
            transports: ['websocket'],
            autoConnect: false,
            reconnection: false // todo learn reconnection abilities
        });
        registry.odb = new OdbProxy(socket);
        bcClient = new BcClient(socket);
        bcClient.onConnect(done);
        socket.connect();
    });

    it('login', function(done) {
        bcClient.login(name, function() {
            bcClient.say('Hello from ' + name);
            done();
        });
    });

    it('create premade', function(done) {
        bcClient.join(name, 'classic', function() {
            // wait for other player / observer
            //setTimeout(done, 10 * 1000);
            done();
        });
    });

    // TODO order of tests?
    it('start game', function(done) {
        bcClient.startGame(1, function() {
            done();
        });
    });

    it('play for a while', function(done) {
        var timeToPlay = 60 * 1000;
        (function step() {
            if (timeToPlay > 0) {
                bcClient.fire();
                timeToPlay -= 1000;
                setTimeout(step, 1000);
            } else {
                done();
            }
        })();
    });
});

run();
