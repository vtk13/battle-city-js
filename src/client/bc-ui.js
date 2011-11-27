// can use bcClient.socket

function BcUi(bcClient)
{
    this.bcClient = bcClient;
    this.initHandlers();
    this.users = new UiUserList(
            bcClient.users,
            $('#public .user-list'), 'user');
    this.premades = new UiPremadeList(
            bcClient.premades,
            $('#public .premades'), 'premade');
    this.messages = new UiMessageList(
            bcClient.messages,
            $('#public .messages'), 'message');
    this.premadeUsers = new UiPremadeUserList(
            bcClient.premadeUsers,
            $('#premade .user-list'), 'user',
            bcClient.currentPremade);
    this.premadeMessages = new UiMessageList(
            bcClient.premadeMessages,
            $('#premade .messages'), 'message');
    this.tankStack = new UiTankStack(
            bcClient.tankStack,
            $('#game #bot-stack'), 'bot');
    this.userPoints = new UserPoint(bcClient.premadeUsers);
    this.fieldView = new FieldView(bcClient.field);

    var self = this;
    bcClient.currentPremade.on('change', function() {
        self.onCurrentPremadeChange(this);
    });

    bcClient.socket.on('logged', this.onLogged.bind(this));
    bcClient.socket.on('unjoined', this.onUnjoined.bind(this));
    bcClient.socket.on('user-message', this.onUserMessage.bind(this));
    bcClient.socket.on('nickNotAllowed', function(){
        alert('Ник занят. Выберите другой.');
    });
    bcClient.socket.on('doNotFlood', function() {
        alert('Слишком много сообщений за минуту.');
    });
    bcClient.socket.on('disconnect', function() {
        clearInterval(self.fieldView.animateIntervalId);
        $('body').html('<h3 style="text-align: center;">Извините, подключение '
            + 'прервано. Перезагрузите страницу, чтобы начать заново.</h3>');
    });
    bcClient.socket.on('joined', this.onJoined.bind(this));
    bcClient.socket.on('started', function(){
        $('#premade').hide();
        $('#game').show();
        clearInterval(self.fieldView.animateIntervalId);
        self.fieldView.animateIntervalId =
            setInterval(self.fieldView.animateStep.bind(self.fieldView), 50);
    });
    bcClient.socket.on('gameover', function() {
        $('#game').hide();
        $('#premade').show();
        clearInterval(self.fieldView.animateIntervalId);
    });
};

BcUi.prototype.onLogged = function()
{
    $('#login').hide();
    $('#public').show();
};

BcUi.prototype.onCurrentPremadeChange = function(premade)
{
    var levelSelect = $('.level select');
    levelSelect.empty();
    for (var i = 1; i <= (premade.type == 'classic' ? 35 : 1); i++) {
        levelSelect.append($('<option value="' + i + '">' + i + '</option>'));
    }
    levelSelect.val(premade.level);
};

BcUi.prototype.onJoined = function()
{
    $('#public').hide();
    $('#create').hide();
    $('#premade').show();
};

BcUi.prototype.onUnjoined = function()
{
    clearInterval(this.fieldView.animateIntervalId);
    $('#premade').hide();
    $('#public').show();
};

BcUi.prototype.onUserMessage = function(data)
{
    alert(data.message);
};

BcUi.prototype.initHandlers = function()
{
    var self = this;
    var bcClient = this.bcClient;

    bcClient.onConnect(function(){
        $('#message-connecting').hide();
        $('#login-form').show();
    });
    bcClient.onConnectFail(function(){
        $('#message-connecting').html('Извините, не удалось подключиться к серверу.' +
                ' Возможно вы находитесь за прокси, которая рубит WebSocket трафик (в ' +
                'будущем шанс подключиться через такие прокси будет увеличен с помошью ssl-соединения).');
    });

    $('#login-form').submit(function(){
        self.bcClient.login($('#login input[name=nick]').val());
        return false;
    });
    $('form.message-form').submit(function(){
        var text = $(':text', this).val();
        if (text) bcClient.say(text);
        $(':text', this).val('').focus();
        return false;
    });
    $('#create-form').submit(function(){
        var name = $('input[name=name]', this).val();
        var gameType = $('input[name=type]', this).val();
        if (name) {
            bcClient.join(name, gameType);
        }
        return false;
    });
    $('.premade').live('click', function(){
        bcClient.join($('.name', this).text());
        return false;
    });
    $('#public .user').live('click', function(){
        var nick = $(this).text();
        var input = $('#public .message-form :text');
        input.val(nick + ': ' + input.val());
        input.focus();
    });
    $('#premade .user').live('click', function(){
        var nick = $(this).text();
        var input = $('#premade .message-form :text');
        input.val(nick + ': ' + input.val());
        input.focus();
    });
    $('input.exit-game').click(function(){
        bcClient.unjoin();
    });
    $('input.start-game').click(function(){
        bcClient.startGame($('#premade select[name=level]').val());
    });
    new TankController({
        startMove   : bcClient.startMove.bind(bcClient),
        stopMove    : bcClient.stopMove.bind(bcClient),
        fire        : bcClient.fire.bind(bcClient)
    });

    $('a#create-game').click(function(){
        $('#public').hide();
        $('#create').show();
        return false;
    });
    $('a#create-to-public').click(function(){
        $('#create').hide();
        $('#public').show();
        return false;
    });
    $('.game-modes li').click(function(){
        $('#create-form input[name=type]').val(this.id);
        $('.game-modes li').removeClass('current');
        $(this).addClass('current');
    });
};
