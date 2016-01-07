define(['component-emitter'], function(Emitter) {
    function Message(text)
    {
        this.time = Date.now();
        this.text = text;
    }

    Emitter(Message.prototype);

    return Message;
});
