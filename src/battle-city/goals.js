
Goal = function Goal(clan)
{
    this.clan = clan;
    this.status = 0; // 0 - active, 1 - done
};

Eventable(Goal.prototype);

Goal.prototype.check = function()
{
    throw new Error('subclass responsibility');
};

Goal.prototype.reset = function(field)
{
    this.status = 0;
};

GoalCheckPoint = function GoalCheckPoint(clan, x, y)
{
    Goal.call(this, clan);
    this.checkpoint = new Checkpoint(x, y);
};

GoalCheckPoint.prototype = new Goal();
GoalCheckPoint.prototype.constructor = GoalCheckPoint;

GoalCheckPoint.prototype.check = function()
{
    var res = this.clan.game.field.intersect(this.checkpoint);
    var clan = this.clan;
    for (var i in res) {
        if (res[i] instanceof Tank && res[i].clan == clan.enemiesClan) {
            clan.game.field.remove(this.checkpoint);
            this.status = 1;
            this.emit('change');
        }
    }
};

GoalCheckPoint.prototype.reset = function()
{
    this.status = 0;
    this.clan.game.field.add(this.checkpoint);
};

GoalCheckPoint.prototype.serialize = function()
{
    return [
        serializeTypeMatches[this.constructor.name], // 0
        this.id, // 1
        this.status, // 2
        this.checkpoint.x, // 3
        this.checkpoint.y // 4
    ];
};

GoalCheckPoint.prototype.unserialize = function(data)
{
    this.id = data[1];
    this.status = data[2];
    this.checkpoint = new Checkpoint(data[3], data[4]);
};
