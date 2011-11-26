
var registry = {}, field, premade = new Premade();

function isClient()
{
    return true;
};

function appendPublicMessages(event) {
    if (event[0/*type*/] == 'a'/*add*/) {
        var date = new Date(event[1/*data*/].time);
        var time = date.getHours() + ':' + (date.getMinutes() < 10 ? 0 : '') + date.getMinutes();
        var message = $('<div><span>' +
                time + '</span> </div>');
        message.append($('<span/>').text('<' + event[1/*data*/].nick + '> '));
        message.append($('<span/>').text(event[1/*data*/].text));
        $('#public .messages').append(message);
        if (($('#public .chat-log').get(0).scrollHeight - $('#public .chat-log').get(0).scrollTop) < ($('#public .chat').height() + 100)) {
            $('#public .chat-log').get(0).scrollTop = $('#public .chat-log').get(0).scrollHeight;
        }
    }
};

function appendPremadeMessages(event) {
    if (event[0/*type*/] == 'a'/*add*/) {
        var date = new Date(event[1/*data*/].time);
        var time = date.getHours() + ':' + (date.getMinutes() < 10 ? 0 : '') + date.getMinutes();
        var message = $('<div><span>' +
                time + '</span> </div>');
        message.append($('<span/>').text('<' + event[1/*data*/].nick + '> '));
        message.append($('<span/>').text(event[1/*data*/].text));
        $('#premade .messages').append(message);
        if (($('$premade .chat-log').get(0).scrollHeight - $('$premade .chat-log').get(0).scrollTop) < ($('$premade .chat').height() + 100)) {
            $('$premade .chat-log').get(0).scrollTop = $('$premade .chat-log').get(0).scrollHeight;
        }
    }
};

function updatePremades(event) {
    var _premade = new Premade();
    _premade.unserialize(event[1/*data*/]);
    switch (event[0/*type*/]) {
    case 'a'/*add*/:
    case 'c'/*change*/:
        if (_premade.id == premade.id) {
            premade = _premade;
            var levelSelect = $('.level select');
            levelSelect.empty();
            for (var i = 1; i <= (premade.type == 'classic' ? 35 : 1); i++) {
                levelSelect.append($('<option value="' + i + '">' + i + '</option>'));
            }
            levelSelect.val(premade.level);
        }
        var stat = ' (' + _premade.userCount + '/' + (_premade.type == 'classic' ? 2 : 4) + ')';
        if ($('#public .premades .premade' + _premade.id).size() == 0) {
            $('#public .premades').append($('<div class="premade premade' +
                _premade.id + '"><span class="name"/><span class="stat"/></div>'));
        }
        if (_premade.locked) {
            $('#public .premades .premade' + _premade.id).addClass('locked');
        } else {
            $('#public .premades .premade' + _premade.id).removeClass('locked');
        }
        $('#public .premades .premade' + _premade.id + ' .name').text(_premade.name);
        $('#public .premades .premade' + _premade.id + ' .stat').text(stat);
        break;
    case 'r'/*remove*/:
        $('#public .premades .premade' + _premade.id).remove();
        break;
    }
};

$(function() {
    if (typeof WebSocket == 'undefined' && typeof MozWebSocket == 'undefined') {
        $('#message-connecting').html('Извините, но ваш браузер не поддерживает websocket. ' +
            'Рекомендуемые браузеры - <a href="http://www.google.com/chrome/">Google Chrome</a> версии 14 и выше, и <a href="http://www.mozilla.org/">Firefox</a> версии 7 и выше.');
        return;
    }

    window.registry.users = new TUserList($('#public .user-list'), undefined, 'user');
        // todo move to premade object
    window.registry.premadeUsers = new TPremadeUserList($('#premade .user-list'), function(user) {
            return user.premadeId == premade.id;
        }, 'user');
    window.registry.tankStack = new TTankStack($('#game #bot-stack'), undefined, 'bot');

    var canvas = document.getElementById('field');
    field = new Field(canvas.width, canvas.height);
    field.context = canvas.getContext('2d');

    var socket = io.connect(location.href, {
        'auto connect': false,
        'reconnect': false // todo learn reconnection abilities
    });

    socket.on('connect', function(){
        $('#message-connecting').hide();
        $('#login-form').show();
    });

    function socketErrorHandler(){
        $('#message-connecting').html('Извините, не удалось подключиться к серверу.' +
                ' Возможно вы находитесь за прокси, которая рубит WebSocket трафик (в ' +
                'будущем шанс подключиться через такие прокси будет увеличен с помошью ssl-соединения).');
    }
    socket.on('connect_failed', socketErrorHandler).on('error', socketErrorHandler);

    socket.on('logged', function(data){
        $('#login').hide();
        $('#public').show();
        registry.users.setCurrent(registry.currentId = data.userId);
        $('form.message-form').submit(function(){
            var text = $(':text', this).val();
            if (text) {
                socket.emit('say', {
                    text: text
                });
            }
            $(':text', this).val('').focus();
            return false;
        });
        $('#create-form').submit(function(){
            var name = $('input[name=name]', this).val();
            var gameType = $('input[name=type]', this).val();
            if (name) {
                socket.json.send({
                    type: 'join',
                    gameType: gameType,
                    name: name
                });
            }
            return false;
        });
        $('.premade').live('click', function(){
            socket.json.send({
                type: 'join',
                name: $('.name', this).text()
            });
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
            socket.json.send({
                type: 'unjoin'
            });
        });
        $('input.start-game').click(function(){
            socket.json.send({
                type: 'start',
                level: $('#premade select[name=level]').val()
            });
        });
        new TankController({
            startMove: function(direction)
            {
                socket.json.send({type: 'control', move: direction});
            },
            stopMove: function()
            {
                socket.json.send({type: 'control', stop: 1});
            },
            fire: function()
            {
                socket.json.send({type: 'control', fire: 1});
            }
        });
    });
    socket.on('message', function(data) {
        switch (data.type) {
            case 'user-message':
                alert(data.message);
                break;
            case 'joined':
                $('#public').hide();
                $('#create').hide();
                $('#premade').show();
                premade.unserialize(data.premade);
                registry.premadeUsers.importItems(registry.users.items);
                registry.premadeUsers.setCurrent(registry.currentId);
                break;
            case 'unjoined':
                $('#premade').hide();
                $('#public').show();
                premade = new Premade();
                break;
            case 'started':
                $('#premade').hide();
                $('#game').show();
                field.animateIntervalId = setInterval(function(){field.animateStep();}, 50);
                break;
            case 'gameover':
                $('#game').hide();
                $('#premade').show();
                clearInterval(field.animateIntervalId);
                break;
        }
    });
    socket.on('clearCollection', function(data){
        switch (data) {
        case 'f':
            field.clear();
            break;
        case 'game.botStack':
            registry.tankStack.clear();
            break;
        case 'premade.users':
            registry.premadeUsers.clear();
            break;
        case 'premade.messages':
            $('#premade .messages').empty();
            break;
        }
    });
    socket.on('sync', function(data) {
        if (data['users']) {
            registry.users.updateWith(data['users']);
        }
        if (data['messages']) {
            for (var i in data.messages) {
                appendPublicMessages(data.messages[i]);
            }
        }
        if (data['premades']) {
            for (var i in data.premades) {
                updatePremades(data.premades[i]);
            }
        }
        if (data['premade.users']) {
            registry.premadeUsers.updateWith(data['premade.users']);
            var players = registry.premadeUsers.items;
            var current = 1;
            for (var i in players) {
                $('.player' + current + '-stats')
                    .text(players[i].lives + ':' + players[i].points);
                current++;
            }
            for (var i = current ; current <= 4 ; current++) {
                $('.player' + current + '-stats').text('');
            }
        }
        if (data['premade.messages']) {
            for (var i in data['premade.messages']) {
                appendPremadeMessages(data['premade.messages'][i]);
            }
        }
        if (data['f']) {
            field.updateWith(data['f']);
        }
        if (data['game.botStack']) {
            // todo quick hack
            for (var i in data['game.botStack']) {
                var type = unserializeTypeMatches[data['game.botStack'][i][1/*data*/][0/*type*/]];
                obj = new (window[type])();
                obj.unserialize(data['game.botStack'][i][1/*data*/]);
                data['game.botStack'][i][1/*data*/] = obj;
            }
            registry.tankStack.updateWith(data['game.botStack']);
        }
    });
    socket.on('nickNotAllowed', function(){
        alert('Ник занят. Выберите другой.');
    });
    socket.on('doNotFlood', function() {
        alert('Слишком много сообщений за минуту.');
    });
    socket.on('disconnect', function() {
        $('body').html('<h3 style="text-align: center;">Извините, подключение прервано. Перезагрузите страницу, чтобы начать заново.</h3>');
    });

    $('#login-form').submit(function(){
        socket.emit('login', {
            nick: $('#login input[name=nick]').val()
        });
        return false;
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
    socket.socket.connect();
});
