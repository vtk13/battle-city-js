requirejs.config({
    paths: {
          'jquery': '/bower_components/jquery/dist/jquery.min'
        , 'jquery-ui': '/bower_components/jquery-ui/jquery-ui.min'
        , 'socket.io': '/bower_components/socket.io-client/socket.io'
    },
    shim: {
        'jquery-ui': {
            deps: ['jquery']
        }
    }
});

require(['jquery', 'jquery-ui', 'socket.io', 'css/screen.js',
        'src/store/serialization.js',
        'src/ui/widgets/common.js',
        'src/client/bc-client.js',
        'src/ui/manager.js',
        'src/battle-city/client/graphic-loader.js',
        'src/common/registry.js',
        'src/store/odb_proxy.js'], function($, ui, io, screen, serialization, widgetsCommon,
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
