define([
    'jquery',
    'src/ui/widgets/common.js',
    'src/ui/widgets/public.js',
    'src/ui/widgets/premade.js',
    'src/ui/widgets/game.js',
    'src/ui/widgets/notifier.js'
], function(
    $,
    widgetsCommon,
    WidgetPublic,
    WidgetPremade,
    WidgetGame,
    WidgetNotifier
) {
    function UiManager(client)
    {
        this.client = client;

        this.loginForm  = new widgetsCommon.WidgetLoginForm($('#login'), client);
        this.publicArea = new WidgetPublic($('#public'), client);
        this.createGame = new widgetsCommon.WidgetCreateGame($('#create'), client);
        this.premade    = new WidgetPremade($('#premade'), client);
        this.game       = new WidgetGame($('#game'), client);

        this.notifier       = new WidgetNotifier(client);

        var self = this;

        client.onConnect(this.setStateLogin.bind(this));
        client.onConnectFail(this.setStateConnectionFail.bind(this));

        window.clientServerMessageBus.on('joined', function() {
            self.setStatePremade();
        });

        window.clientServerMessageBus.on('unjoined', function() {
            self.setStatePublic();
        });

        window.clientServerMessageBus.on('disconnect', this.setStateDiconnected.bind(this));
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

    return UiManager;
});
