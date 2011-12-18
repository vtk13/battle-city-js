
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

    client.socket.on('gameover', this.setStateGameOver.bind(this));
    client.socket.on('started', this.setStateGameRunning.bind(this));
    client.socket.on('joined', this.resetState.bind(this));

    $('.exit-game', context).click(function(){
        client.unjoin();
    });

    $('.exit-exercise', context).click(function(){
        client.unjoin();
    });

    $('.start-game', context).click(function(){
        client.startGame($('select[name=level]', context).val());
    });
    $('.execute-code', context).click(function(){
        client.executeCode(window.codeMirror.getValue());
    });
    $('.stop-game', context).click(function(){
        client.stopGame();
    });
    $('.restart-game', context).click(function(){
        client.stopGame();
        client.startGame($('select[name=level]', context).val());
    });
};

UiGameControls.prototype.resetState =
UiGameControls.prototype.setStateGameOver = function()
{
    $('.start-game'  , this.context).removeAttr('disabled');
    $('.stop-game'   , this.context).attr('disabled', 'disabled');
    $('.execute-code', this.context).attr('disabled', 'disabled');
};

UiGameControls.prototype.setStateGameRunning = function()
{
    $('.start-game'  , this.context).attr('disabled', 'disabled');
    $('.stop-game'   , this.context).removeAttr('disabled');
    $('.execute-code', this.context).removeAttr('disabled');
};
