define(['src/common/list.js',
        'src/common/premade.js'], function(TList, Premade) {
    function TPremadeList()
    {
        TList.apply(this, arguments);
    };

    TPremadeList.prototype = new TList();
    TPremadeList.prototype.constructor = TPremadeList;

    TPremadeList.prototype.join = function(event, user)
    {
        var gameName = event.name && event.name.substr(0,20);
        if (!user.premade) {
            var premade;
            for (var i in this.items) {
                if (this.items[i].name == gameName) {
                    premade = this.items[i];
                    break;
                }
            }
            if (!premade) {
                if (this.count() >= 100) { // games limit
                    throw {message: "Не получается создать игру. Достигнут максимум одновременных игр на сервере."};
                } else {
                    premade = new Premade(gameName, event.gameType);
                    this.add(premade);
                }
            }
            premade.join(user);
        } else {
            throw {message: "User already in premade - " + user.premade.id + " (bug?)"};
        }
    };

    return TPremadeList;
});