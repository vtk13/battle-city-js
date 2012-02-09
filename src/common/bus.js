define(['src/common/event.js'], function(Eventable) {
    function ClientServerMessageBus()
    {

    };

    Eventable(ClientServerMessageBus.prototype);

    function ServerInterfaceSimple(messageBus, socket)
    {
        this.bind('login'       , messageBus, socket);
        this.bind('set-course'  , messageBus, socket);
        this.bind('say'         , messageBus, socket);
        this.bind('join'        , messageBus, socket);
        this.bind('unjoin'      , messageBus, socket);
        this.bind('start'       , messageBus, socket);
        this.bind('stop-game'   , messageBus, socket);
        this.bind('execute'     , messageBus, socket);
        this.bind('control'     , messageBus, socket);

        this.bind('logged'          , socket, messageBus);
        this.bind('joined'          , socket, messageBus);
        this.bind('unjoined'        , socket, messageBus);
        this.bind('connect'         , socket, messageBus);
        this.bind('connect_failed'  , socket, messageBus);
        this.bind('error'           , socket, messageBus);
        this.bind('gameover'        , socket, messageBus);
        this.bind('disconnect'      , socket, messageBus);
        this.bind('started'         , socket, messageBus);
        this.bind('course-changed'  , socket, messageBus);
        this.bind('user-message'    , socket, messageBus);
        this.bind('nickNotAllowed'  , socket, messageBus);
        this.bind('doNotFlood'      , socket, messageBus);
        this.bind('task-done'       , socket, messageBus);
        this.bind('sync'            , socket, messageBus);
        this.bind('clearCollection' , socket, messageBus);
    };

    ServerInterfaceSimple.prototype.bind = function(type, messageBus, socket)
    {
        messageBus.on(type, function(data) {
            socket.emit(type, data);
        });
    };

    function ServerInterfaceLocal(messageBus, socket)
    {
        this.bind('login'       , messageBus, socket);
        this.bind('set-course'  , messageBus, socket);
        this.bind('say'         , messageBus, socket);
        this.bind('join'        , messageBus, socket);
        this.bind('unjoin'      , messageBus, socket);
        messageBus.on('start', function(event) {
    //        var premade = window.bcClient.currentPremade;
    //        if (premade.userCount == 1) {
    //            event.local = 1;
    //            socket.emit('start', event);
    //            if (event.level && premade.level != event.level) {
    //                premade.level = event.level;
    //            }
    //            premade.startGame();
    //        } else {
                socket.emit('start', event);
    //        }
        });
        this.bind('stop-game'   , messageBus, socket);
        this.bind('execute'     , messageBus, socket);
        this.bind('control'     , messageBus, socket);

        this.bind('logged'          , socket, messageBus);
        this.bind('joined'          , socket, messageBus);
        this.bind('unjoined'        , socket, messageBus);
        this.bind('connect'         , socket, messageBus);
        this.bind('connect_failed'  , socket, messageBus);
        this.bind('error'           , socket, messageBus);
        this.bind('gameover'        , socket, messageBus);
        this.bind('disconnect'      , socket, messageBus);
        this.bind('started'         , socket, messageBus);
        this.bind('course-changed'  , socket, messageBus);
        this.bind('user-message'    , socket, messageBus);
        this.bind('nickNotAllowed'  , socket, messageBus);
        this.bind('doNotFlood'      , socket, messageBus);
        this.bind('task-done'       , socket, messageBus);
        this.bind('sync'            , socket, messageBus);
        this.bind('clearCollection' , socket, messageBus);
    };

    ServerInterfaceLocal.prototype.bind = ServerInterfaceSimple.prototype.bind;

    return {
        ClientServerMessageBus: ClientServerMessageBus,
        ServerInterfaceSimple: ServerInterfaceSimple,
        ServerInterfaceLocal: ServerInterfaceLocal
    };
});