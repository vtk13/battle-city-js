
//====== WidgetLevelSelector ===================================================

function WidgetLevelSelector(context, client)
{
    client.currentPremade.on('change', function() {
        // "this" is client.currentPremade
        var levelSelect = $('select', context);
        levelSelect.empty();
        for (var i = 1; i <= Premade.types[this.type].levels; i++) {
            levelSelect.append($('<option value="' + i + '">' + i + '</option>'));
        }
        levelSelect.val(this.level);
    });
};

//====== UserPoint =============================================================

function UserPoint(premadeUsers)
{
    premadeUsers.on('add', this.onChange.bind(this));
    premadeUsers.on('change', this.onChange.bind(this));
    premadeUsers.on('remove', this.onRemove.bind(this));
};

UserPoint.prototype.onChange = function(user)
{
    // todo hack
    var pos = user.positionId + (user.clan == 2 ? 2 /*first clan capacity*/ : 0);
    $('.player' + pos + '-stats')
        .text(user.lives + ':' + user.points);
};

UserPoint.prototype.onRemove = function(user)
{
    // todo hack
    var pos = user.positionId + (user.clan == 2 ? 2 /*first clan capacity*/ : 0);
    $('.player' + pos + '-stats').text('');
};

//====== WidgetCreateGame ======================================================

function WidgetCreateGame(context, client)
{
    $('#create-form', context).submit(function(){
        var name = $('input[name=name]', this).val();
        var gameType = $('input[name=type]', this).val();
        if (name) {
            client.join(name, gameType);
        }
        return false;
    });
    $('.game-modes li', context).click(function(){
        $('#create-form input[name=type]').val(this.id);
        $('.game-modes li').removeClass('current');
        $(this).addClass('current');
    });
};

//====== WidgetLoginForm =======================================================

function WidgetLoginForm(context, client)
{
    var toPage = 'setStatePublic';

    $('#game-login', context).submit(function(){
        client.login($('input[name=nick]', this).val());
        return false;
    });

    $('#tutor-login', context).submit(function(){
        toPage = 'setStateExercises';
        client.login($('input[name=nick]', this).val());
        return false;
    });

    client.socket.on('logged', function(){
        window.uiManager[toPage]();
    });
};

