define([
    'jquery',
    'src/ui/widgets/lists.js'
], function(
    $,
    widgetsLists
) {
    function WidgetPublicChat(context, client)
    {
        this.context = context;
        this.client = client;
        this.users = new widgetsLists.UiUserList(
                client.users,
                $('.user-list', context), 'user');
        this.messages = new widgetsLists.UiMessageList(
                client.messages,
                $('.messages', context), 'message');

        this.init();
    }

    WidgetPublicChat.prototype.init = function()
    {
        var self = this;
        $(this.context).on('click', '.user', function(){
            // "this" is a div.user
            var nick = $(this).text();
            var input = $('.message-form :text', self.context);
            input.val(nick + ': ' + input.val());
            input.focus();
        });

        $('form.message-form', this.context).submit(function(){
            // "this" is a form
            var text = $(':text', this).val();
            if (text) self.client.say(text);
            $(':text', this).val('').focus();
            return false;
        });
    };

    function WidgetPremadeChat(context, client)
    {
        this.context = context;
        this.client = client;
        this.premadeUsers = new widgetsLists.UiPremadeUserList(
                client.premadeUsers,
                $('.user-list', context), 'user',
                client
        );
        this.premadeMessages = new widgetsLists.UiMessageList(
                client.premadeMessages,
                $('.messages', context), 'message'
        );

        this.init();
    }

    WidgetPremadeChat.prototype.init = WidgetPublicChat.prototype.init;

    return {
        WidgetPublicChat: WidgetPublicChat,
        WidgetPremadeChat: WidgetPremadeChat
    };
});
