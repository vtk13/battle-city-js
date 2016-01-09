var $ = require('jquery');
var TankController = require('src/client/keyboard.js');
var widgetsLists = require('src/ui/widgets/lists.js');
var widgetsCommon = require('src/ui/widgets/common.js');
var FieldView = require('src/ui/widgets/field-view.js');
var UiGameControls = require('src/ui/widgets/game-controls.js');

function WidgetGame(context, client)
{
    this.controller = new TankController(client);
    this.tankStack = new widgetsLists.UiTankStack(
            client.tankStack,
            $('#bot-stack', context), 'bot');
    this.userPoints = new widgetsCommon.UserPoint(client.premadeUsers);
    this.fieldView = new FieldView(context, client);
    this.gameControls = new UiGameControls(context, client);
}

module.exports = WidgetGame;
