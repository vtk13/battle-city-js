
function UiManager(client)
{
    this.client = client;

    this.premadeGameControls = new UiGameControls($('#premade'), client);
    this.botGameControls = new UiGameControls($('#bot-editor'), client);
};
