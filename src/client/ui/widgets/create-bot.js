
function WidgetCreateBot(context, client)
{
    this.levelSelector = new WidgetLevelSelector($('.level', context), client);
    this.gameControls = new UiGameControls(context, client);

};
