var $ = require('jquery');
import List from 'src/ui/widgets/lists';
var React = require('react');
var ReactDom = require('react-dom');

var Users = React.createClass({
    mixins: [List],
    renderElement: function(user) {
        var current = (window.bcClient.currentUserId === user.id ? 'current ' : '');
        return <li key={user.id} className={'user user' + user.id + ' current'}>{user.nick}</li>;
    }
});

var Messages = React.createClass({
    mixins: [List],
    renderElement: function(message) {
        var date = new Date(message.time);
        var time = date.getHours() + ':' + (date.getMinutes() < 10 ? 0 : '') + date.getMinutes();
        return <div key={message.id} className={'message message' + message.id}>
            <span className="time">{time}</span>
            <span className="nick">&lt;{message.nick}&gt;</span>
            <span className="text">{message.text}</span>
        </div>;
    }
});

function WidgetPublicChat(context, client)
{
    this.context = context;
    this.client = client;

    ReactDom.render(<Users items={client.users} />, $('.user-list', context).get(0));
    ReactDom.render(<Messages items={client.messages} />, $('.messages', context).get(0));

    this.init();
}

WidgetPublicChat.prototype.init = function()
{
    var self = this;
    $(this.context).on('click', '.user', function() {
        // "this" is a div.user
        var nick = $(this).text();
        var input = $('.message-form :text', self.context);
        input.val(nick + ': ' + input.val());
        input.focus();
    });

    $('form.message-form', this.context).submit(function() {
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

    ReactDom.render(<Users items={client.premadeUsers} />, $('.user-list', context).get(0));
    ReactDom.render(<Messages items={client.premadeMessages} />, $('.messages', context).get(0));

    this.init();
}

WidgetPremadeChat.prototype.init = WidgetPublicChat.prototype.init;

module.exports = {
    WidgetPublicChat: WidgetPublicChat,
    WidgetPremadeChat: WidgetPremadeChat
};
