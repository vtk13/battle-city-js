
function WidgetPremade(context, client)
{
    this.levelSelector = new WidgetLevelSelector($('.level', context), client);
    this.chat = new WidgetPremadeChat(context, client);
    this.gameControls = new UiGameControls(context, client);

};
