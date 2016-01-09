var $ = require('jquery');
var ui = require('jquery-ui');
var io = require('socket.io-client');
var screen = require('css/screen.js');
var serialization = require('src/battle-city/serialization.js');
var widgetsCommon = require('src/ui/widgets/common.js');
var BcClient = require('src/client/bc-client.js');
var UiManager = require('src/ui/manager.js');
var graphicLoader = require('src/battle-city/client/graphic-loader.js');
var registry = require('src/common/registry.js');
var OdbProxy = require('src/engine/store/odb_proxy.js');

// there are all existing global vars below
// todo all this vars should be used with window.
window.bcClient = null;
window.uiManager = null;

new widgetsCommon.WidgetLangSelector();

if (typeof WebSocket == 'undefined' && typeof MozWebSocket == 'undefined') {
    $('.ui-block').hide().filter('#nowebsocket').show();
} else {
    // substitute ws.
    var wsDomain = (location.hostname == 'localhost' ? '' : 'ws.')
        + location.hostname
        + (location.port ? ':' + location.port : '');
    window.clientServerMessageBus = io(wsDomain, {
        transports: ['websocket'],
        autoConnect: false,
        reconnection: false // todo learn reconnection abilities
    });
    registry.odb = new OdbProxy(window.clientServerMessageBus);
    bcClient = new BcClient(window.clientServerMessageBus);
    uiManager = new UiManager(bcClient);
    window.clientServerMessageBus.connect();
}

$(window).resize();
