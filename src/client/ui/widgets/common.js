
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

//======

function WidgetCreateGame(client)
{
    $('#create-form').submit(function(){
        var name = $('input[name=name]', this).val();
        var gameType = $('input[name=type]', this).val();
        if (name) {
            client.join(name, gameType);
        }
        return false;
    });
    $('#create-bot').click(function(){
        var name = 'createbot-' + client.user.id;
        var gameType = 'createbot';
        client.join(name, gameType);
        return false;
    });
    $('.game-modes li').click(function(){
        $('#create-form input[name=type]').val(this.id);
        $('.game-modes li').removeClass('current');
        $(this).addClass('current');
    });
};

