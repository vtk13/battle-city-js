var $ = require('jquery');
var lang = require('src/lang/lang.js');
var Premade = require('src/common/premade.js');

//====== WidgetLevelSelector ===================================================

function WidgetLevelSelector(context, client)
{
    client.currentPremade.on('change', function() {
        // "this" is client.currentPremade
        var levelSelect = $('select', context);
        levelSelect.empty();
        for (var i = 1; i <= Premade.maxLevels; i++) {
            levelSelect.append($('<option value="' + i + '">' + i + '</option>'));
        }
        levelSelect.val(this.level);
    });
}

//====== UserPoint =============================================================

function UserPoint(premadeUsers)
{
    premadeUsers.on('add', this.onChange.bind(this));
    premadeUsers.on('change', this.onChange.bind(this));
    premadeUsers.on('remove', this.onRemove.bind(this));
}

UserPoint.prototype.onChange = function(user)
{
    $('.player' + user.positionId + '-stats').text(user.lives + ':' + user.points);
};

UserPoint.prototype.onRemove = function(user)
{
    $('.player' + user.positionId + '-stats').text('');
};

//====== WidgetCreateGame ======================================================

function WidgetCreateGame(context, client)
{
    $('#create-form', context).submit(function() {
        var name = $('input[name=name]', this).val();
        if (name) {
            client.join(name);
        }
        return false;
    });
}

//====== WidgetLoginForm =======================================================

function WidgetLoginForm(context, client)
{
    $('#game-login', context).submit(function(){
        var nick = $('input[name=nick]', this).val();
        client.login(nick, function() {
            window.uiManager.setStatePublic();
        });
        return false;
    });
}

module.exports = {
    WidgetLevelSelector: WidgetLevelSelector,
    UserPoint: UserPoint,
    WidgetCreateGame: WidgetCreateGame,
    WidgetLoginForm: WidgetLoginForm,
};
