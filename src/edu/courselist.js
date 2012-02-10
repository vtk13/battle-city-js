define(['src/common/collection.js',
        'src/edu/course.js'], function(Collection, courses) {
    function CoursesList()
    {
        Collection.apply(this, arguments);
        this.add(new courses.CoursePascalBasics());
        this.add(new courses.CourseAlgoritms());
    };

    CoursesList.prototype = new Collection();
    CoursesList.prototype.constructor = CoursesList;

    return CoursesList;
});