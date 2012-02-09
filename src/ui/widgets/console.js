define(function(){
    function WidgetConsole(context, client)
    {
        client.on('compile-error', function(ex){
            context.text(context.text() + ex.message + '\n');
        });
        client.on('write', function(data){
            context.text(context.text() + data);
        });
    }

    return WidgetConsole;
});