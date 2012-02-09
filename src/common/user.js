define(['src/common/event.js'], function(Eventable) {
    /**
     * this is for both, client and server.
     */

    function User()
    {

    };

    Eventable(User.prototype);

    return User;
});