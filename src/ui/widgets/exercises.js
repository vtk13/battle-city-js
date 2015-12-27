define(['src/ui/widgets/lists.js'], function(widgetsLists) {
    function WidgetExercises(context, client)
    {
        this.courses = new widgetsLists.UiCoursesList(client.courses, $('.courses', context), 'course', client);
        this.exercises = new widgetsLists.UiExercisesList(client.exercises, $('.exercise-list', context), 'exercise');

        $(context).on('click', '.exercise .select', function(){
            var name = 'createbot-' + client.currentUser.id;
            client.join(name, 'createbot');
            client.startGame(parseInt($(this).attr('level')));
            return false;
        });
    };

    return WidgetExercises;
});