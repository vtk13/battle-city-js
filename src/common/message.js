define(['src/common/event.js'], function(Eventable) {
    function Message(text)
    {
        this.time = Date.now();
        this.text = text;
    };

    Eventable(Message.prototype);

    return Message;
});