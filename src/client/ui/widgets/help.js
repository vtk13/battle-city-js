
function WidgetHelp(context, client)
{
    client.socket.on('started', function(){
        $.get('/help/ex1/1-ru.html', function(data){
            $('.content', context).html(data);

            $('.content .code', context).each(function(){
                CodeMirror.runMode($(this).addClass('cm-s-night').text(), "pascal", this);
            });
        });
    });
};
