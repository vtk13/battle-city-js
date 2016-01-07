require([
    'jquery',
    'jquery-ui',
    'socket.io-client',
    'css/screen.js',
    'src/battle-city/serialization.js',
    'src/ui/widgets/common.js',
    'src/client/bc-client.js',
    'src/ui/manager.js',
    'src/battle-city/client/graphic-loader.js',
    'src/common/registry.js',
    'src/engine/store/odb_proxy.js'
], function(
    $,
    ui,
    io,
    screen,
    serialization,
    widgetsCommon,
    BcClient,
    UiManager,
    graphicLoader,
    registry,
    OdbProxy
) {
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
});
