define(['jquery'], function($) {
    /**
     *
     * @param context
     * @param client
     * @return
     */
    function UiGameControls(context, client)
    {
        this.context = context;
        this.resetState();
        var self = this;

        window.clientServerMessageBus.on('gameover', this.setStateGameOver.bind(this));
        window.clientServerMessageBus.on('started', this.setStateGameRunning.bind(this));
        window.clientServerMessageBus.on('joined', this.resetState.bind(this));

        $('.exit-game', context).click(function(){
            client.unjoin();
        });

        $('.start-game', context).click(function(){
            client.startGame($('select[name=level]', context).val());
        });
    }

    UiGameControls.prototype.resetState =
    UiGameControls.prototype.setStateGameOver = function()
    {
        $('.start-game', this.context).removeAttr('disabled');
    };

    UiGameControls.prototype.setStateGameRunning = function()
    {
        $('.start-game', this.context).attr('disabled', 'disabled');
    };

    return UiGameControls;
});
