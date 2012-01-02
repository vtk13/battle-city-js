
function WidgetExercises(context, client)
{
    this.courses = new UiCoursesList(client.courses, $('.courses', context), 'course', client);

    $('.exercise .select', context).live('click', function(){
        var name = 'createbot-' + client.user.id;
        client.join(name, 'createbot');
        client.startGame(parseInt($(this).attr('level')));
        return false;
    });
};
