
function WidgetExercises(context, client)
{
    $('.exercise', context).live('click', function(){
        $('.selected-exercise .desc', context).html($(this).html());
    });
    $('#create-bot', context).click(function(){
        var name = 'createbot-' + client.user.id;
        client.join(name, 'createbot');
        return false;
    });
};
