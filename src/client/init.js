var $ = require('jquery');
var ui = require('jquery-ui');
var io = require('socket.io-client');
var screen = require('css/screen.js');
var serialization = require('src/battle-city/serialization.js');
var widgetsCommon = require('src/ui/widgets/common.js');
var BcClient = require('src/client/bc-client.js');
var UiManager = require('src/ui/manager.js');
require('src/battle-city/client/graphic-loader.js');
var Odb = require('src/engine/store/odb.js');

// there are all existing global vars below
// todo all this vars should be used with window.
window.bcClient = null;
window.uiManager = null;


// substitute ws.
var wsDomain = (location.hostname == 'localhost' ? '' : 'ws.')
    + location.hostname
    + (location.port ? ':' + location.port : '');
var socket = io(wsDomain, {
    transports: ['websocket'],
    autoConnect: false,
    reconnection: false // todo learn reconnection abilities
});
Odb.instance(new Odb(socket));
bcClient = new BcClient(socket);
uiManager = new UiManager(bcClient);
socket.connect();

$(window).resize();
