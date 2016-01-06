define([
    'jquery',
    'src/client/keyboard.js',
    'src/ui/widgets/lists.js',
    'src/ui/widgets/common.js',
    'src/ui/widgets/field-view.js',
    'src/ui/widgets/game-controls.js'
], function(
    $,
    TankController,
    widgetsLists,
    widgetsCommon,
    FieldView,
    UiGameControls
) {
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

    return WidgetGame;
});
