var Emitter = require('component-emitter');

module.exports = User;

/**
 * this is for both, client and server.
 */
function User()
{

}

Emitter(User.prototype);
