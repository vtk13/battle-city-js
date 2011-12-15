
function UiManager(client)
{
    this.client = client;

    this.gameControls = new UiGameControls($('#bot-editor'), client);
};
