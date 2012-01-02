
CoursesList = function CoursesList()
{
    TList.apply(this, arguments);
    this.add(new Course(1, 'course-pascal-basics'));
    this.add(new Course(2, 'course-algoritms'));
};

CoursesList.prototype = new TList();
CoursesList.prototype.constructor = CoursesList;
