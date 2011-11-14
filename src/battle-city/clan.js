
Clan = function Clan()
{
    this.enemiesClan = null;
    this.users = [];
};

Clan.prototype.attachUser = function(user)
{
    if (user.clan) user.clan.detachUser(user);
    this.users.push(user);
    user.clan = this;
    user.emit('change', {type: 'change', object: user});
};

Clan.prototype.size = function()
{
    return this.users.length;
};

Clan.prototype.isFull = function()
{
    return this.users.length == 2;
};

Clan.prototype.detachUser = function(user)
{
    if (user.clan) {
        var i = this.users.indexOf(user);
        if (i >= 0) {
            this.users.splice(i, 1);
        }
        user.clan = null;
        user.emit('change', {type: 'change', object: user});
    }
};
