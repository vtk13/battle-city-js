
Message = function Message(text)
{
    this.time = Date.now();
    this.text = text;
};

Eventable(Message.prototype);

Message.prototype.serialize = function()
{
    return {
        id: this.id,
        time: this.time,
        userId: this.user.id,
        nick: this.user.nick,
        text: this.text
    };
};
