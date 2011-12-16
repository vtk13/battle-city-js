// can use bcClient.socket

function BcUi(bcClient)
{
    this.bcClient = bcClient;
    var self = this;

    $('#login-form').submit(function(){
        self.bcClient.login($('#login input[name=nick]').val());
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
    $('.game-modes li').click(function(){
        $('#create-form input[name=type]').val(this.id);
        $('.game-modes li').removeClass('current');
        $(this).addClass('current');
    });
};
