
/**
 *
 * @param context
 * @param client
 * @return
 */
function UiGameControls(context, client)
{
    Widget.call(this, context);
    this.resetState();
    var self = this;

    client.socket.on('gameover', this.setStateGameOver.bind(this));
    client.socket.on('started', this.setStateGameRunning.bind(this));
    client.socket.on('joined', this.resetState.bind(this));

    $('input.exit-game', context).click(function(){
        client.unjoin();
    });
    $('input.start-game', context).click(function(){
        client.startGame($('select[name=level]', context).val());
    });
    $('input.execute-code', context).click(function(){
        client.executeCode(window.codeMirror.getValue());
    });
    $('input.stop-game', context).click(function(){
        client.stopGame();
    });
};

UiGameControls.prototype = new Widget();
UiGameControls.prototype.constructor = UiGameControls;

UiGameControls.prototype.resetState =
UiGameControls.prototype.setStateGameOver = function()
{
    $('input.start-game'  , this.context).removeAttr('disabled');
    $('input.stop-game'   , this.context).attr('disabled', 'disabled');
    $('input.execute-code', this.context).attr('disabled', 'disabled');
};

UiGameControls.prototype.setStateGameRunning = function()
{
    $('input.start-game'  , this.context).attr('disabled', 'disabled');
    $('input.stop-game'   , this.context).removeAttr('disabled');
    $('input.execute-code', this.context).removeAttr('disabled');
};
