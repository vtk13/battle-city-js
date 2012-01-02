
ExerciseList = function ExerciseList()
{
    TList.apply(this, arguments);
};

ExerciseList.prototype = new TList();
ExerciseList.prototype.constructor = ExerciseList;
