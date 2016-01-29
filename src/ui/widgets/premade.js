var $ = require('jquery');
var widgetsCommon = require('src/ui/widgets/common.js');
var widgetsChat = require('src/ui/widgets/chat.jsx');
var UiGameControls = require('src/ui/widgets/game-controls.js');

function WidgetPremade(context, client)
{
    this.levelSelector = new widgetsCommon.WidgetLevelSelector($('.level', context), client);
    this.chat = new widgetsChat.WidgetPremadeChat(context, client);
    this.gameControls = new UiGameControls(context, client);
}

module.exports = WidgetPremade;
