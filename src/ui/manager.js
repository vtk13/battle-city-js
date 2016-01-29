var $ = require('jquery');
var widgetsCommon = require('src/ui/widgets/common.js');
var WidgetPublic = require('src/ui/widgets/public.jsx');
var WidgetPremade = require('src/ui/widgets/premade.js');
var WidgetGame = require('src/ui/widgets/game.js');
var WidgetNotifier = require('src/ui/widgets/notifier.js');

function UiManager(client)
{
    this.client = client;

    this.loginForm  = new widgetsCommon.WidgetLoginForm($('#login'), client);
    this.publicArea = new WidgetPublic($('#public'), client);
    this.createGame = new widgetsCommon.WidgetCreateGame($('#create'), client);
    this.premade    = new WidgetPremade($('#premade'), client);
    this.game       = new WidgetGame($('#game'), client);

    this.notifier   = new WidgetNotifier(client);

    client.onConnect(this.setStateLogin.bind(this));
    client.onConnectFail(this.setStateConnectionFail.bind(this));

    client.socket.on('joined', this.setStatePremade.bind(this));
    client.socket.on('unjoined', this.setStatePublic.bind(this));
    client.socket.on('disconnect', this.setStateDiconnected.bind(this));
}

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
    this._slideTo($('#premade').add('#game'));
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

module.exports = UiManager;
