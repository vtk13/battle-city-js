
function WidgetNotifier(client)
{
    window.clientServerMessageBus.on('user-message', function(data) {
        alert(data.message);
    });
    window.clientServerMessageBus.on('nickNotAllowed', function(){
        alert('Ник занят. Выберите другой.');
    });
    window.clientServerMessageBus.on('doNotFlood', function() {
        alert('Слишком много сообщений за минуту.');
    });
};
