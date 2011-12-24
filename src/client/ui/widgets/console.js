
function WidgetConsole(context, client)
{
    client.on('compile-error', function(ex){
        var h = new Date().getHours();
        var m = new Date().getMinutes();
        var time = (h < 10 ? '0' + h : h) + ':' + (m < 10 ? '0' + m : m);
        var line = $('<div><span class="time">' + time + '</span>' + ex.message + '</div>');
        line.hide();
        context.prepend(line);
        line.show('fast');
    });
}
