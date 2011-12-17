
function UiManager(client)
{
    this.client = client;

    this.loginForm  = new WidgetLoginForm($('#login'), client);
    this.publicArea = new WidgetPublic($('#public'), client);
    this.createGame = new WidgetCreateGame($('#create'), client);
    this.premade    = new WidgetPremade($('#premade'), client);
    this.game       = new WidgetGame($('#game'), client);
    this.createBot  = new WidgetCreateBot($('#bot-editor'), client);

    this.notifier   = new WidgetNotifier(client);

    var self = this;

    client.onConnect(this.setStateLogin.bind(this));
    client.onConnectFail(this.setStateConnectionFail.bind(this));

    client.socket.on('logged', this.setStatePublic.bind(this));
    client.socket.on('joined', function(){
        if (client.currentPremade.type == 'createbot') {
            self.setStateCreateBot();
        } else {
            self.setStatePremade();
        }
    });
    client.socket.on('unjoined', this.setStatePublic.bind(this));
    client.socket.on('disconnect', this.setStateDiconnected.bind(this));
};

UiManager.prototype.setStateLogin = function()
{
    $('.ui-block').hide();
    $('#login').show();
};

UiManager.prototype.setStateConnectionFail = function()
{
    $('.ui-block').hide();
    $('#connecting-fail').hide();
};

UiManager.prototype.setStateDiconnected = function()
{
    $('.ui-block').hide();
    $('#disconnect').show();
};

UiManager.prototype.setStatePublic = function()
{
    this._slideTo($('#public').add('#create'));
};

UiManager.prototype.setStatePremade = function()
{
    $('#field').removeClass('create-bot');
    this._slideTo($('#premade').add('#game'));
};

UiManager.prototype.setStateCreateBot = function()
{
    this.createBot.reset();
    $('#field').addClass('create-bot');
    this._slideTo($('#bot-editor').add('#game'));
};

UiManager.prototype._slideTo = function(toShow)
{
    var body = $('body');
    body.css('overflow', 'hidden');
    toShow.show();
    var up = toShow.offset().top < 10; // slide up or down
    if (up) {
        body.scrollTop(body.height());
    }

    body.animate({scrollTop: up ? 0 : body.height()}, function(){
        $('.ui-block').not(toShow).hide();
        body.css('overflow', 'auto');
    });
};
