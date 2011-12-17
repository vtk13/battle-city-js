
function WidgetGame(context, client)
{
    this.controller = new TankController(client);
    this.tankStack = new UiTankStack(
            client.tankStack,
            $('#bot-stack', context), 'bot');
    this.userPoints = new UserPoint(client.premadeUsers);
    this.fieldView = new FieldView(client);
};
