define(['css/screen.js',
        'src/store/serialization.js',
        'src/ui/widgets/common.js',
        'src/client/bc-client.js',
        'src/ui/manager.js',
        'src/battle-city/client/graphic-loader.js',
        'src/common/registry.js',
        'src/store/odb_proxy.js'], function(screen, serialization, widgetsCommon,
                BcClient, UiManager, graphicLoader, registry, OdbProxy) {
    // there are all existing global vars below
    // todo all this vars should be used with window.
    window.bcClient = null;
    window.uiManager = null;
    window.codeMirror = null; // todo better place?

    new widgetsCommon.WidgetLangSelector();

    if (typeof WebSocket == 'undefined' && typeof MozWebSocket == 'undefined') {
        $('.ui-block').hide().filter('#nowebsocket').show();
    } else {
        // substitute ws.
        var wsDomain = 'ws.' + location.hostname + (location.port ? ':' + location.port : '');
        var src = 'http://' + wsDomain + '/socket.io/socket.io.js';
        $.getScript(src, function(){
            window.clientServerMessageBus = io.connect(wsDomain, {
                'auto connect' : false,
                'reconnect' : false // todo learn reconnection abilities
            });
            registry.odb = new OdbProxy(window.clientServerMessageBus);
            bcClient = new BcClient(window.clientServerMessageBus);
            uiManager = new UiManager(bcClient);
            window.clientServerMessageBus.socket.connect();
        });
    }

    $(window).resize();
});
