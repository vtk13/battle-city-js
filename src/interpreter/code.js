Action = function Action()
{

};

Action.prototype.step = function()
{
    throw "Subclass responsibility";
};

ActionMove = function ActionMove(distance)
{
    this.distance = distance;
};
ActionMove.prototype = new Action();
ActionMove.prototype.costructor = ActionMove;

ActionMove.prototype.step = function()
{
    return {
        'action': {
            'move': this.distance
        }
    };
};

ActionTurn = function ActionTurn(direction)
{
    this.direction = direction;
};
ActionTurn.prototype = new Action();
ActionTurn.prototype.costructor = ActionTurn;

ActionTurn.prototype.step = function()
{
    return {
        'action': {
            'turn': this.direction
        }
    };
};
