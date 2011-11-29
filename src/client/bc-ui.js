// can use bcClient.socket

function BcUi(bcClient)
{
    this.bcClient = bcClient;
    this.codeMirror = null;
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
        clearInterval(self.fieldView.animateIntervalId);
        self.fieldView.animateIntervalId =
            setInterval(self.fieldView.animateStep.bind(self.fieldView), 50);
    });
    bcClient.socket.on('gameover', function(event) {
        clearInterval(self.fieldView.animateIntervalId);
        if (event.winnerClan == self.bcClient.currentClan) {
            self.fieldView.message('Победа!');
        } else {
            self.fieldView.message('Вы проиграли');
        }
    });
};

BcUi.prototype.onLogged = function()
{
    $('body').css('overflow', 'hidden');
    $('#public').show();
    $('#create').show();
    $('body').animate({scrollTop: $('body').height()}, function(){
        $('#login').hide();
        $('body').css('overflow', 'auto');
    });
};

BcUi.prototype.onCurrentPremadeChange = function(premade)
{
    var levelSelect = $('.level select');
    levelSelect.empty();
    for (var i = 1; i <= (premade.type != 'teamvsteam' ? 35 : 1); i++) {
        levelSelect.append($('<option value="' + i + '">' + i + '</option>'));
    }
    levelSelect.val(premade.level);
};

BcUi.prototype.onJoined = function(event)
{
    $('body').css('overflow', 'hidden');
    if (this.bcClient.currentPremade.type == 'createbot') {
        $('#bot-editor').show();
        if (this.codeMirror === null) {
            this.codeMirror = CodeMirror(document.getElementById('editor'), {
                value: "/**\n\
 * API:\n\
 * tank.startMove('up'|'down'|'left'|'right');\n\
 * tank.stopMove();\n\
 * tank.fire();\n\
 * \n\
 * field.intersect(x, y, halfWidth, halfHeight);\n\
 */\n",
                mode:  "javascript"
            });
        }
    } else {
        $('#premade').show();
    }
    $('#game').show();
    $('body').animate({scrollTop: $('body').height()}, function(){
        $('#public').hide();
        $('#create').hide();
        $('body').css('overflow', 'auto');
    });
};

BcUi.prototype.onUnjoined = function()
{
    $('body').css('overflow', 'hidden');
    clearInterval(this.fieldView.animateIntervalId);
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
        var name = 'createbot-' + bcClient.userId;
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
    $('input.exit-game').click(function(){
        bcClient.unjoin();
    });
    $('#premade input.start-game').click(function(){
        bcClient.startGame($('#premade select[name=level]').val());
    });
    $('#bot-editor input.start-game').click(function(){
        bcClient.botSource = self.codeMirror.getValue();
        bcClient.startGame($('#bot-editor select[name=level]').val());
    });
    $('input.stop-game').click(function(){
        bcClient.stopGame();
    });
    new TankController({
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
