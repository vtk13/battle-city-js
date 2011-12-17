
function WidgetNotifier(client)
{
    client.socket.on('user-message', function(data) {
        alert(data.message);
    });
    client.socket.on('nickNotAllowed', function(){
        alert('Ник занят. Выберите другой.');
    });
    client.socket.on('doNotFlood', function() {
        alert('Слишком много сообщений за минуту.');
    });
};
