define([
    'src/ui/widgets/common.js',
    'src/ui/widgets/chat.js',
    'src/ui/widgets/game-controls.js'
], function(
    widgetsCommon,
    widgetsChat,
    UiGameControls
) {
    function WidgetPremade(context, client)
    {
        this.levelSelector = new widgetsCommon.WidgetLevelSelector($('.level', context), client);
        this.chat = new widgetsChat.WidgetPremadeChat(context, client);
        this.gameControls = new UiGameControls(context, client);
    }

    return WidgetPremade;
});
