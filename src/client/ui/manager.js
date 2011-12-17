
function UiManager(client)
{
    this.client = client;

    this.premade = new WidgetPublic($('#public'), client);

    this.tankStack = new UiTankStack(
            client.tankStack,
            $('#game #bot-stack'), 'bot');
    this.userPoints = new UserPoint(client.premadeUsers);

    this.levelSelector1 = new WidgetLevelSelector($('#premade .level'), client); // extract to premade widget
    this.levelSelector2 = new WidgetLevelSelector($('#bot-editor .level'), client); // extract to create bot widget

    this.premadeChat = new WidgetPremadeChat($('#premade'), client);

    this.loginForm = new WidgetLoginForm('#login', client);
    this.createGame = new WidgetCreateGame($('#create'), client);

    var self = this;

    this.fieldView = new FieldView(client);
    this.premadeGameControls = new UiGameControls($('#premade'), client);
    this.botGameControls = new UiGameControls($('#bot-editor'), client);


    client.onConnect(this.setStateLogin.bind(this));
    client.onConnectFail(this.setStateConnectionFail.bind(this));

    client.socket.on('logged', this.setStatePublicFromLogin.bind(this));
    client.socket.on('joined', function(){
        if (client.currentPremade.type == 'createbot') {
            self.setStateCreateBot();
        } else {
            self.setStatePremade();
        }
    });
    client.socket.on('unjoined', this.setStatePublicFromPremade.bind(this));
    client.socket.on('user-message', function(data) {
        alert(data.message);
    });

    client.socket.on('nickNotAllowed', function(){
        alert('Ник занят. Выберите другой.');
    });
    client.socket.on('doNotFlood', function() {
        alert('Слишком много сообщений за минуту.');
    });
    client.socket.on('disconnect', this.setStateDiconnected.bind(this));

    new TankController(client);
};

UiManager.prototype.setStateLogin = function()
{
    $('#connecting').hide();
    $('#login').show();
};

UiManager.prototype.setStateConnectionFail = function()
{
    $('#connecting').hide();
    $('#connecting-fail').hide();
};

UiManager.prototype.setStateDiconnected = function()
{
    $('.ui-block').hide();
    $('#disconnect').show();
};

UiManager.prototype.setStatePublicFromPremade = function()
{
    var body = $('body');
    body.css('overflow', 'hidden');
    $('#public').show();
    $('#create').show();
    body.scrollTop(body.height());

    body.animate({scrollTop: 0}, function(){
        $('#bot-editor').hide();
        $('#premade').hide();
        $('#game').hide();
        body.css('overflow', 'auto');
    });
};

UiManager.prototype.setStatePublicFromLogin = function()
{
    var body = $('body');
    body.css('overflow', 'hidden');
    $('#public').show();
    $('#create').show();
    body.animate({scrollTop: body.height()}, function(){
        $('#login').hide();
        body.css('overflow', 'auto');
    });
};

UiManager.prototype.setStatePremade = function()
{
    $('body').css('overflow', 'hidden');
    $('#premade').show();
    $('#field').removeClass('create-bot');
    $('#game').show();
    $('body').animate({scrollTop: $('body').height()}, function(){
        $('#public').hide();
        $('#create').hide();
        $('body').css('overflow', 'auto');
    });
};

UiManager.prototype.setStateCreateBot = function()
{
    $('body').css('overflow', 'hidden');
    $('#field').addClass('create-bot');
    $('#bot-editor').show();
    if (window.codeMirror === null) {
        window.codeMirror = CodeMirror(document.getElementById('editor'), {
            value: "Program Level1;\n" +
                   "begin\n" +
                   "  move(176);\n" +
                   "  turn(\"right\");\n" +
                   "  move(160);\n" +
                   "end.",
            mode:  "pascal"
        });
    }
    $('#game').show();
    $('body').animate({scrollTop: $('body').height()}, function(){
        $('#public').hide();
        $('#create').hide();
        $('body').css('overflow', 'auto');
    });
};
