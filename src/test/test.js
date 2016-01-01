var requirejs = require("requirejs");

requirejs([
    'socket.io-client', 'assert', 'src/client/bc-client.js',
    'src/common/registry.js', 'src/store/odb_proxy.js'
], function(
    io, assert, BcClient,
    registry, OdbProxy
) {
    describe('IN ORDER TO play single player mode AS a player I NEED TO', function () {
        var bcClient = null;
        before(function(done) {
            var socket = io('http://localhost:8124', {
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
            bcClient.login('test', function() {
                done();
            });
        });

        it('create premade', function(done) {
            bcClient.join('test', 'classic', function() {
                done();
            });
        });

        // TODO order of tests?
        it('start game', function(done) {
            bcClient.startGame(1, function() {
                done();
            });
        });
    });
    run();
});
