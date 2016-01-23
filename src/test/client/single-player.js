// чтобы писать подобные тесты нужно как-то отделять ServerUser от ClientUser и другие подобные объекты

//var assert = require('chai').assert;
//var Client = require('src/client/bc-client.js');
//var BcServerInterface = require('src/common/server.js');
//BcServerInterface.updateInterval = 0;
//var Premade = require('src/common/premade.js');
//Premade.stepInterval = 0;
//var Emitter = require('component-emitter');
//
//var Collection = require('src/engine/store/collection.js');
//var users = new Collection();
//
//function DelayingEmitter()
//{
//    Emitter.apply(this, arguments);
//}
//
//DelayingEmitter.prototype = Object.create(Emitter.prototype);
//DelayingEmitter.prototype.constructor = DelayingEmitter;
//
//DelayingEmitter.prototype.emit = function() {
//    var self = this;
//    var args = arguments;
//    //console.log('emit', args[0]);
//    // emit on next tick, run client and server code it different ticks
//    setTimeout(function() {
//        //console.log('emited', args[0]);
//        Emitter.prototype.emit.apply(self, args);
//    }, 0);
//};
//
//describe('Single player', function() {
//    it('Player is able to login and start game', function(done) {
//        var socket = new DelayingEmitter();
//        var server = new BcServerInterface(socket, users);
//        var client = new Client(socket);
//        client.login('test1', function() {
//            client.join('test1', 'classic', function() {
//                client.startGame(1);
//                socket.on('step', function() {
//                    socket.emit('disconnect');
//                    server.onDisconnect = function() {
//                        console.log('dis');
//                        BcServerInterface.prototype.onDisconnect.apply(this, arguments);
//                        console.log(server.users.length);
//                        done();
//                    };
//                });
//            });
//        });
//    });
//});
