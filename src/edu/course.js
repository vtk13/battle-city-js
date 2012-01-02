
Course = function Course(id, name)
{
    this.id = id;
    this.name = name;
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

};

CoursePascalBasics.prototype = new Course(1, 'course-pascal-basics');

CourseAlgoritms = function CourseAlgoritms()
{

};

CourseAlgoritms.prototype = new Course(2, 'course-algoritms');
