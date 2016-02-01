var $ = require('jquery');
import List from 'src/ui/widgets/lists';
var widgetsChat = require('src/ui/widgets/chat.js');
var React = require('react');
var ReactDom = require('react-dom');

var Premades = React.createClass({
    mixins: [List],
    renderElement: function(premade, { client }) {
        var locked = premade.isLocked() ? 'locked ' : '';
        var className = 'premade premade' + premade.id + ' ' + locked;
        return <div key={premade.id} className={className} onClick={() => client.join(premade.name)}>
            <span className="name">{premade.name}</span>
            <span className="stat">({premade.users.length})</span>
        </div>;
    }
});

function WidgetPublic(context, client)
{
    ReactDom.render(<Premades client={client} items={client.premades} />, $('.premades', context).get(0));
    this.publicChat = new widgetsChat.WidgetPublicChat(context, client);
}

module.exports = WidgetPublic;
