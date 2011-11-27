
Message = function Message(text)
{
    this.time = Date.now();
    this.text = text;
};

Eventable(Message.prototype);

Message.prototype.serialize = function()
{
    return [
        serializeTypeMatches[this.constructor.name] // 0
      , this.id // 1
      , this.time // 2
      , this.user.id // 3
      , this.user.nick // 4
      , this.text // 5
    ];
};

Message.prototype.unserialize = function(data)
{
    this.id     = data[1];
    this.time   = data[2];
    this.userId = data[3];
    this.nick   = data[4];
    this.text   = data[5];
};
