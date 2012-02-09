define(['src/common/list.js',
        'src/edu/course.js'], function(TList, courses) {
    function CoursesList()
    {
        TList.apply(this, arguments);
        this.add(new courses.CoursePascalBasics());
        this.add(new courses.CourseAlgoritms());
    };

    CoursesList.prototype = new TList();
    CoursesList.prototype.constructor = CoursesList;

    return CoursesList;
});