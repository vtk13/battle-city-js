
function UserPoint(premadeUsers)
{
    premadeUsers.on('add', this.onChange.bind(this));
    premadeUsers.on('change', this.onChange.bind(this));
    premadeUsers.on('remove', this.onRemove.bind(this));
};

UserPoint.prototype.onChange = function(user)
{
    // todo hack
    var pos = user.positionId + (user.clan == 2 ? 2 /*first clan capacity*/ : 0);
    $('.player' + pos + '-stats')
        .text(user.lives + ':' + user.points);
};

UserPoint.prototype.onRemove = function(user)
{
    // todo hack
    var pos = user.positionId + (user.clan == 2 ? 2 /*first clan capacity*/ : 0);
    $('.player' + pos + '-stats').text('');
};
