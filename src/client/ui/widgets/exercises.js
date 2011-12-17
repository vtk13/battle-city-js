
function WidgetExercises(context, client)
{
    $('.exercise', context).live('click', function(){
        $('.selected-exercise .desc', context).html($(this).html());
    });
    $('#create-bot', context).click(function(){
        var name = 'createbot-' + client.user.id;
        var gameType = 'createbot';
        client.join(name, gameType);
        return false;
    });
};
