// can use bcClient.socket

function BcUi(bcClient)
{
    this.bcClient = bcClient;
    var self = this;

    $('#login-form').submit(function(){
        self.bcClient.login($('#login input[name=nick]').val());
        return false;
    });
    $('.premade').live('click', function(){
        bcClient.join($('.name', this).text());
        return false;
    });
};
