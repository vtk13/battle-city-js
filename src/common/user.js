/**
 * this is for both, client and server.
 */

User = function User()
{

};

Eventable(User.prototype);

/**
 * @todo hack for BcClient.onUserChange()
 * @param data
 * @return
 */
User.prototype.serialize = function()
{
    var res = [];
    res[1] = this.id;
    res[2] = this.nick;
    res[3] = this.lives;
    res[4] = this.points;
    res[5] = this.clan;
    res[6] = this.premadeId;
    res[7] = this.positionId;
    res[8] = this.tankId;
    res[9] = this.currentCourseId;
    return res;
};

User.prototype.unserialize = function(data)
{
    this.id     = data[1];
    this.nick   = data[2];
    this.lives  = data[3];
    this.points = data[4];
    this.clan   = data[5];
    this.premadeId  = data[6];
    this.positionId = data[7];
    this.tankId     = data[8];
    this.currentCourseId    = data[9];
};
