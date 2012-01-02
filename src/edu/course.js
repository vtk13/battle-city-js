
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
