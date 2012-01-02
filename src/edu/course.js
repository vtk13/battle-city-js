
Course = function Course(id, name)
{
    this.id = id;
    this.name = name;
//    this.execises = new TList();
};

Course.prototype.serialize = function()
{
    return [
        serializeTypeMatches[this.constructor.name], // 0
        this.id, // 1
        this.name // 2
    ];
    // z is constant
};

Course.prototype.unserialize = function(data)
{
    this.id = data[1];
    this.name = data[2];
};

CoursePascalBasics = function CoursePascalBasics()
{
    this.execises = new TList();
    this.execises.add(new Exercise('pascal-algoritm1', 1));
    this.execises.add(new Exercise('pascal-algoritm2', 2));
    this.execises.add(new Exercise('pascal-if-statement', 3));
    this.execises.add(new Exercise('pascal-for-statement', 4));
};

CoursePascalBasics.prototype = new Course(1, 'course-pascal-basics');

CourseAlgoritms = function CourseAlgoritms()
{
    this.execises = new TList();
    this.execises.add(new Exercise('algoritms-wayfinder', 1));
};

CourseAlgoritms.prototype = new Course(2, 'course-algoritms');
