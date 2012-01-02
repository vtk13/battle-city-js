
Exercise = function Exercise(name)
{
    this.name = name;
};

Exercise.prototype.serialize = function()
{
    return [
        serializeTypeMatches[this.constructor.name], // 0
        this.id, // 1
        this.name // 2
    ];
    // z is constant
};

Exercise.prototype.unserialize = function(data)
{
    this.id = data[1];
    this.name = data[2];
};
