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

    var self = this;
    bcClient.currentPremade.on('change', function() {
        self.onCurrentPremadeChange(this);
    });

    bcClient.socket.on('user-message', this.onUserMessage.bind(this));
    bcClient.socket.on('nickNotAllowed', function(){
        alert('Ник занят. Выберите другой.');
    });
    bcClient.socket.on('doNotFlood', function() {
        alert('Слишком много сообщений за минуту.');
    });
    bcClient.socket.on('disconnect', function() {
        clearInterval(self.bcClient.botCodeInterval);
        clearInterval(self.bcClient.codeInterval);
        $('body').html('<h3 style="text-align: center;">Извините, подключение '
            + 'прервано. Перезагрузите страницу, чтобы начать заново.</h3>');
    });
};

BcUi.prototype.onCurrentPremadeChange = function(premade)
{
    var levelSelect = $('#premade .level select');
    levelSelect.empty();
    // todo get level count from somewhere else
    for (var i = 1; i <= Premade.types[premade.type].levels; i++) {
        levelSelect.append($('<option value="' + i + '">' + i + '</option>'));
    }
    levelSelect.val(premade.level);

    var levelSelect = $('#bot-editor .level select');
    levelSelect.empty();
    // todo get level count from somewhere else
    for (var i = 1; i <= Premade.types[premade.type].levels; i++) {
        levelSelect.append($('<option value="' + i + '">' + i + '</option>'));
    }
    levelSelect.val(premade.level);
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
    $('#create-bot').click(function(){
        var name = 'createbot-' + bcClient.user.id;
        var gameType = 'createbot';
        bcClient.join(name, gameType);
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
    new TankController({
        turn        : bcClient.turn.bind(bcClient),
        startMove   : bcClient.startMove.bind(bcClient),
        stopMove    : bcClient.stopMove.bind(bcClient),
        fire        : bcClient.fire.bind(bcClient)
    });
    $('.game-modes li').click(function(){
        $('#create-form input[name=type]').val(this.id);
        $('.game-modes li').removeClass('current');
        $(this).addClass('current');
    });
};
