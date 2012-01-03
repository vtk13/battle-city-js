
function WidgetPublic(context, client)
{
    this.premades = new UiPremadeList(
            client.premades,
            $('.premades', context), 'premade');

    this.publicChat = new WidgetPublicChat(context, client);

    $('.premade', context).live('click', function(){
        client.join($('.name', this).text());
        return false;
    });
};
