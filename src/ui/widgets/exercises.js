
function WidgetExercises(context, client)
{
    this.courses = new UiCoursesList(client.courses, $('.courses', context), 'course', client);
    this.exercises = new UiExercisesList(client.exercises, $('.exercise-list', context), 'exercise');

    $('.exercise .select', context).live('click', function(){
        var name = 'createbot-' + client.currentUser.id;
        client.join(name, 'createbot');
        client.startGame(parseInt($(this).attr('level')));
        return false;
    });
};
