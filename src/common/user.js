define(['component-emitter'], function(Emitter) {
    /**
     * this is for both, client and server.
     */
    function User()
    {

    }

    Emitter(User.prototype);

    return User;
});
