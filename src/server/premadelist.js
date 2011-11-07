
TPremadeList = function TPremadeList()
{
};

TPremadeList.prototype = new TList();
TPremadeList.prototype.constructor = TPremadeList;

TPremadeList.prototype.join = function(event, user)
{
    if (!user.premade) {
        var premade;
        for (var i in this.items) {
            if (this.items[i].name == event.name) {
                premade = this.items[i];
                break;
            }
        }
        if (!premade) {
            premade = new Premade(event.name);
            this.add(premade);
        }
        premade.join(user);
    } else {
        throw {message: "User already in premade - " + user.premade.id};
    }
};
