
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
            if (this.count() >= 6) { // games limit
                throw {message: "Не получается создать игру. Достигнут максимум одновременных игр на сервере."};
            } else {
                premade = new Premade(event.name, event.gameType);
                this.add(premade);
            }
        }
        premade.join(user);
    } else {
        throw {message: "User already in premade - " + user.premade.id + " (bug?)"};
    }
};
