
CoursesList = function CoursesList()
{
    TList.apply(this, arguments);
    this.add(new CoursePascalBasics());
    this.add(new CourseAlgoritms());
};

CoursesList.prototype = new TList();
CoursesList.prototype.constructor = CoursesList;
