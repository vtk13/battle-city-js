
var bcClient, bcUi, uiManager;

var codeMirror = null; // todo better place?

$(function() {

    if (typeof WebSocket == 'undefined' && typeof MozWebSocket == 'undefined') {
        $('#message-connecting').html('Извините, но ваш браузер не поддерживает websocket. ' +
            'Рекомендуемые браузеры - <a href="http://www.google.com/chrome/">Google Chrome</a> версии 14 и выше, и <a href="http://www.mozilla.org/">Firefox</a> версии 7 и выше.');
    } else {
        // hack to substitute ws.
        var wsDomain = 'ws.' + location.hostname + (location.port ? ':' + location.port : '');
        var src = 'http://' + wsDomain + '/socket.io/socket.io.js';
        $.getScript(src, function(){
            bcClient = new BcClient(wsDomain);
            bcUi = new BcUi(bcClient);
            uiManager = new UiManager(bcClient);
            bcClient.connect();
        });
    }

    $(window).resize();
});
