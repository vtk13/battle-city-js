
//FIXME move to BcClient
var field;

var bcClient, bcUi;

$(function() {
    if (typeof WebSocket == 'undefined' && typeof MozWebSocket == 'undefined') {
        $('#message-connecting').html('Извините, но ваш браузер не поддерживает websocket. ' +
            'Рекомендуемые браузеры - <a href="http://www.google.com/chrome/">Google Chrome</a> версии 14 и выше, и <a href="http://www.mozilla.org/">Firefox</a> версии 7 и выше.');
        return;
    }

    bcClient = new BcClient(location.href);
    bcUi = new BcUi(bcClient);
    bcClient.connect();
});
