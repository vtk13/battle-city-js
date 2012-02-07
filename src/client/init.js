
// there are all existing global vars below
// todo all this vars should be used with window.
var bcClient, uiManager;
var codeMirror = null; // todo better place?
var clientServerMessageBus = new ClentServerMessageBus();

$(function() {
    new WidgetLangSelector();

    if (typeof WebSocket == 'undefined' && typeof MozWebSocket == 'undefined') {
        $('.ui-block').hide().filter('#nowebsocket').show();
    } else {
        // hack to substitute ws.
        var wsDomain = 'ws.' + location.hostname + (location.port ? ':' + location.port : '');
        var src = 'http://' + wsDomain + '/socket.io/socket.io.js';
        $.getScript(src, function(){
            var socket = io.connect(wsDomain, {
                'auto connect' : false,
                'reconnect' : false // todo learn reconnection abilities
            });
            new SimpleServerInterface(window.clientServerMessageBus, socket);
            bcClient = new BcClient(socket);
            uiManager = new UiManager(bcClient);
            socket.socket.connect();
        });
    }

    $(window).resize();
});
