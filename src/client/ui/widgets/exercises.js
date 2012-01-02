
function WidgetExercises(context, client)
{
    this.courses = new UiCousesList(client.courses, $('.courses', context), 'course');

    $('.exercise .select', context).live('click', function(){
        var name = 'createbot-' + client.user.id;
        client.join(name, 'createbot');
        client.startGame(parseInt($(this).attr('level')));
        return false;
    });
};
