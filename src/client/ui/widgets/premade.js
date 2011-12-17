
function WidgetPublic(context, client)
{
    this.premades = new UiPremadeList(
            client.premades,
            $('.premades', context), 'premade');

    this.publicChat = new WidgetPublicChat(context, client);
};
