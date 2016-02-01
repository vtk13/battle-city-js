var TankController = require('src/client/keyboard.js');
import { UserPoint } from 'src/ui/widgets/common.js';
var FieldView = require('src/ui/widgets/field-view.js');
var UiGameControls = require('src/ui/widgets/game-controls.js');

export default function WidgetGame(context, client)
{
    this.controller = new TankController(client);
    this.userPoints = new UserPoint(client.premadeUsers);
    this.fieldView = new FieldView(context, client);
    this.gameControls = new UiGameControls(context, client);
}
