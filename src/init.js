
// there are all existing global vars below
var bcClient, uiManager;
var codeMirror = null; // todo better place?

$(function() {

    new WidgetLangSelector();

    if (typeof WebSocket == 'undefined' && typeof MozWebSocket == 'undefined') {
        $('.ui-block').hide().filter('#nowebsocket').show();
    } else {
        // hack to substitute ws.
        var wsDomain = 'ws.' + location.hostname + (location.port ? ':' + location.port : '');
        var src = 'http://' + wsDomain + '/socket.io/socket.io.js';
        $.getScript(src, function(){
            bcClient = new BcClient(wsDomain);
            uiManager = new UiManager(bcClient);
            bcClient.connect();
        });
    }

    $(window).resize();
});
