// can use bcClient.socket

function BcUi(bcClient)
{
    this.bcClient = bcClient;
    this.initHandlers();

    var self = this;
    bcClient.currentPremade.on('change', function() {
        self.onCurrentPremadeChange(this);
    });
};

BcUi.prototype.onCurrentPremadeChange = function(premade)
{
    var levelSelect = $('#premade .level select');
    levelSelect.empty();
    // todo get level count from somewhere else
    for (var i = 1; i <= Premade.types[premade.type].levels; i++) {
        levelSelect.append($('<option value="' + i + '">' + i + '</option>'));
    }
    levelSelect.val(premade.level);

    var levelSelect = $('#bot-editor .level select');
    levelSelect.empty();
    // todo get level count from somewhere else
    for (var i = 1; i <= Premade.types[premade.type].levels; i++) {
        levelSelect.append($('<option value="' + i + '">' + i + '</option>'));
    }
    levelSelect.val(premade.level);
};

BcUi.prototype.initHandlers = function()
{
    var self = this;
    var bcClient = this.bcClient;

    $('#login-form').submit(function(){
        self.bcClient.login($('#login input[name=nick]').val());
        return false;
    });
    $('form.message-form').submit(function(){
        var text = $(':text', this).val();
        if (text) bcClient.say(text);
        $(':text', this).val('').focus();
        return false;
    });
    $('#create-form').submit(function(){
        var name = $('input[name=name]', this).val();
        var gameType = $('input[name=type]', this).val();
        if (name) {
            bcClient.join(name, gameType);
        }
        return false;
    });
    $('#create-bot').click(function(){
        var name = 'createbot-' + bcClient.user.id;
        var gameType = 'createbot';
        bcClient.join(name, gameType);
        return false;
    });
    $('.premade').live('click', function(){
        bcClient.join($('.name', this).text());
        return false;
    });
    $('#public .user').live('click', function(){
        var nick = $(this).text();
        var input = $('#public .message-form :text');
        input.val(nick + ': ' + input.val());
        input.focus();
    });
    $('#premade .user').live('click', function(){
        var nick = $(this).text();
        var input = $('#premade .message-form :text');
        input.val(nick + ': ' + input.val());
        input.focus();
    });
    $('.game-modes li').click(function(){
        $('#create-form input[name=type]').val(this.id);
        $('.game-modes li').removeClass('current');
        $(this).addClass('current');
    });
};
