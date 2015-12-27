define(['src/ui/widgets/lists.js',
        'src/ui/widgets/chat.js'], function(widgetsLists, widgetsChat) {
    function WidgetPublic(context, client)
    {
        this.premades = new widgetsLists.UiPremadeList(
                client.premades,
                $('.premades', context), 'premade');

        this.publicChat = new widgetsChat.WidgetPublicChat(context, client);

        $(context).on('click', '.premade', function(){
            client.join($('.name', this).text());
            return false;
        });
    }

    return WidgetPublic;
});