define(['require',
        'src/common/collection.js',
        'src/edu/exercise.js'], function(require, Collection, Exercise) {
    function Course(id, name)
    {
        this.id = id;
        this.name = name;
    //    this.execises = new Collection();
    };

    function CoursePascalBasics()
    {
        this.execises = new (require('src/common/collection.js'))(); // Collection
        this.execises.add(new Exercise('pascal-algoritm1', 1));
        this.execises.add(new Exercise('pascal-algoritm2', 2));
        this.execises.add(new Exercise('pascal-if-statement', 3));
        this.execises.add(new Exercise('pascal-for-statement', 4));
    };

    CoursePascalBasics.prototype = new Course(1, 'course-pascal-basics');

    function CourseAlgoritms()
    {
        this.execises = new (require('src/common/collection.js'))(); // Collection
        this.execises.add(new Exercise('algoritms-wayfinder', 1));
    };

    CourseAlgoritms.prototype = new Course(2, 'course-algoritms');

    function CourseArena()
    {
        this.execises = new (require('src/common/collection.js'))(); // Collection
        this.execises.add(new Exercise('arena-arena-1', 5));
    };

    CourseArena.prototype = new Course(3, 'course-arena');

    return {
        Course: Course,
        CoursePascalBasics: CoursePascalBasics,
        CourseAlgoritms: CourseAlgoritms,
        CourseArena: CourseArena
    };
});