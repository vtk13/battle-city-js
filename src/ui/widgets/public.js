var $ = require('jquery');
var widgetsLists = require('src/ui/widgets/lists.js');
var widgetsChat = require('src/ui/widgets/chat.js');

function WidgetPublic(context, client)
{
    this.premades = new widgetsLists.UiPremadeList(client.premades, $('.premades', context), 'premade');
    this.publicChat = new widgetsChat.WidgetPublicChat(context, client);

    $(context).on('click', '.premade', function() {
        client.join($('.name', this).text());
        return false;
    });
}

module.exports = WidgetPublic;
