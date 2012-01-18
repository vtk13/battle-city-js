
function UiManager(client)
{
    this.client = client;

    this.loginForm  = new WidgetLoginForm($('#login'), client);
    this.publicArea = new WidgetPublic($('#public'), client);
    this.createGame = new WidgetCreateGame($('#create'), client);
    this.premade    = new WidgetPremade($('#premade'), client);
    this.game       = new WidgetGame($('#game'), client);
    this.createBot  = new WidgetCreateBot($('#bot-editor'), client);
    this.exercises  = new WidgetExercises($('#exercises'), client);
    this.help       = new WidgetHelp($('#tabs-help'), client);

    this.notifier       = new WidgetNotifier(client);
    this.console        = new WidgetConsole($('#console'), client);

    var self = this;

    client.onConnect(this.setStateLogin.bind(this));
    client.onConnectFail(this.setStateConnectionFail.bind(this));

    client.socket.on('joined', function(){
        if (client.currentPremade.type == 'createbot') {
            self.setStateCreateBot();
        } else {
            self.setStatePremade();
        }
    });
    client.socket.on('unjoined', function(){
        if ($('#premade').css('display') == 'block') {
            self.setStatePublic();
        } else {
            self.setStateExercises();
        }
    });
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

UiManager.prototype.setStateExercises = function()
{
    this._slideTo($('#exercises'));
};

UiManager.prototype.setStatePremade = function()
{
    $('#game').removeClass('create-bot');
    this._slideTo($('#premade').add('#game'));
};

UiManager.prototype.setStateCreateBot = function()
{
    this.createBot.reset();
    $('#game').addClass('create-bot');
    this._slideTo($('#bot-editor').add('#game'));
};

UiManager.prototype._slideTo = function(toShow, callback)
{
    $('.ui-block').hide();
    toShow.show();
    callback && callback();
    setTimeout(function(){
        // chrome doesn't fire resize event after a scrollbar has appeared
        $(window).resize();
    }, 100);
};
