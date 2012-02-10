
function ExerciseList()
{
    Collection.apply(this, arguments);
};

ExerciseList.prototype = new Collection();
ExerciseList.prototype.constructor = ExerciseList;
