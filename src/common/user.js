/**
 * this is for both, client and server.
 */

User = function User()
{

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
};
