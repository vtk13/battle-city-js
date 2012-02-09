define(['src/common/event.js',
        'src/battle-city/objects/checkpoint.js',
        'src/battle-city/objects/tank.js'], function(Eventable,
                Checkpoint, Tank) {
    function Goal(clan)
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

    function GoalCheckPoint(clan, x, y)
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

    return {
        GoalCheckPoint: GoalCheckPoint
    };
});