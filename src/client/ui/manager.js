
function UiManager(client)
{
    this.client = client;
    var self = this;

    this.fieldView = new FieldView(client);
    this.premadeGameControls = new UiGameControls($('#premade'), client);
    this.botGameControls = new UiGameControls($('#bot-editor'), client);

    client.socket.on('logged', this.setStatePublicFromLogin.bind(this));
    client.socket.on('joined', function(){
        if (client.currentPremade.type == 'createbot') {
            self.setStateCreateBot();
        } else {
            self.setStatePremade();
        }
    });
    client.socket.on('unjoined', this.setStatePublicFromPremade.bind(this));
};

UiManager.prototype.setStateLogin = function()
{

};

UiManager.prototype.setStatePublicFromPremade = function()
{
    $('body').css('overflow', 'hidden');
    $('#public').show();
    $('#create').show();
    $('body').scrollTop($('body').height());

    $('body').animate({scrollTop: 0}, function(){
        $('#bot-editor').hide();
        $('#premade').hide();
        $('#game').hide();
        $('body').css('overflow', 'auto');
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
