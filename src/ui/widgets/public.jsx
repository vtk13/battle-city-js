var $ = require('jquery');
var widgetsLists = require('src/ui/widgets/lists.jsx');
var widgetsChat = require('src/ui/widgets/chat.jsx');
var React = require('react');
var ReactDom = require('react-dom');

var Premades = React.createClass({
    mixins: [widgetsLists.List],
    renderElement: function(premade) {
        var locked = premade.isLocked() ? 'locked ' : '';
        return <div className={'premade premade' + premade.id + ' ' + locked}>
            <span className="name">{premade.name}</span>
            <span className="stat">({premade.users.length})</span>
        </div>;
    }
});

function WidgetPublic(context, client)
{
    ReactDom.render(<Premades items={client.premades} />, $('.premades', context).get(0));
    this.publicChat = new widgetsChat.WidgetPublicChat(context, client);

    $(context).on('click', '.premade', function() {
        client.join($('.name', this).text());
        return false;
    });
}

module.exports = WidgetPublic;
