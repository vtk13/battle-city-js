define(['require',
        'src/common/list.js',
        'src/edu/exercise.js'], function(require, TList, Exercise) {
    function Course(id, name)
    {
        this.id = id;
        this.name = name;
    //    this.execises = new TList();
    };

    function CoursePascalBasics()
    {
        this.execises = new (require('src/common/list.js'))(); // TList
        this.execises.add(new Exercise('pascal-algoritm1', 1));
        this.execises.add(new Exercise('pascal-algoritm2', 2));
        this.execises.add(new Exercise('pascal-if-statement', 3));
        this.execises.add(new Exercise('pascal-for-statement', 4));
    };

    CoursePascalBasics.prototype = new Course(1, 'course-pascal-basics');

    function CourseAlgoritms()
    {
        this.execises = new (require('src/common/list.js'))(); // TList
        this.execises.add(new Exercise('algoritms-wayfinder', 1));
    };

    CourseAlgoritms.prototype = new Course(2, 'course-algoritms');

    return {
        Course: Course,
        CoursePascalBasics: CoursePascalBasics,
        CourseAlgoritms: CourseAlgoritms
    };
});