
CoursesList = function CoursesList()
{
    TList.apply(this, arguments);
    this.add(new Course('pascal-basics'));
};

CoursesList.prototype = new TList();
CoursesList.prototype.constructor = CoursesList;
