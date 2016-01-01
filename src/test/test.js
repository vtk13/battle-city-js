var requirejs = require("requirejs");

requirejs([
    'socket.io-client', 'assert', 'src/client/bc-client.js',
    'src/common/registry.js', 'src/store/odb_proxy.js'
], function(
    io, assert, BcClient,
    registry, OdbProxy
) {
    describe('BC', function () {
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

        it('sample session', function(done) {
            this.timeout(6000);
            bcClient.login('test');
            bcClient.socket.on('logged', function() {
                bcClient.join('test', 'classic');
                bcClient.socket.on('joined', function() {
                    setTimeout(function() {
                        bcClient.say('Hello, vtk!');
                        done();
                    }, 5000);
                });
            });
        });
    });
    run();
});
