
Exercise = function Exercise(name, level)
{
    this.name = name;
    this.level = level;
};

Exercise.prototype.serialize = function()
{
    return [
        serializeTypeMatches[this.constructor.name], // 0
        this.id, // 1
        this.name, // 2
        this.level // 3
    ];
    // z is constant
};

Exercise.prototype.unserialize = function(data)
{
    this.id = data[1];
    this.name = data[2];
    this.level = data[3];
};
