
var registry = {}, field, premade = {};

Field.prototype.drawItem = function(current)
{
    if (current.z == this.z) {
        for (var i in current.img) {
            this.context.drawImage(window.images[current.img[i]],
                    current.x - current.hw,
                    current.y - current.hh);
        }
    }
};

Field.prototype.draw = function()
{
    this.context.fillStyle = 'rgba(0, 0, 0, 1)';
    this.context.fillRect(0, 0, this.width, this.height);
    for (this.z = 0 ; this.z <= 2 ; this.z++) { // this.z hack?
        this.objects.traversal(this.drawItem, this);
    }
};

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
        $('#public .messages').get(0).scrollTop = $('#public .messages').get(0).scrollHeight;
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
        $('#premade .messages').get(0).scrollTop = $('#premade .messages').get(0).scrollHeight;
    }
};

function updatePremades(event) {
    switch (event[0/*type*/]) {
    case 'a'/*add*/:
    case 'c'/*change*/:
        if (event[1/*data*/].id == premade.id) {
            premade = event[1/*data*/];
            $('.level .value').text(premade.level);
        }
        if ($('#public .premades .premade' + event[1/*data*/].id).size() > 0) {
            $('#public .premades .premade' + event[1/*data*/].id).text(event[1/*data*/].name);
        } else {
            $('#public .premades').append($('<div class="premade premade' +
                event[1/*data*/].id + '"></div>').text(event[1/*data*/].name));
        }
        break;
    case 'r'/*remove*/:
        $('#public .premades .premade' + event[1/*data*/].id).remove();
        break;
    }
};

$(function() {
    window.registry.users = new TUserList($('#public .user-list'), undefined, 'user');
        // todo move to premade object
    window.registry.premadeUsers = new TUserList($('#premade .user-list'), function(user) {
            return user.premadeId == premade.id;
        }, 'user');
    window.registry.tankStack = new TTankStack($('#game #bot-stack'), undefined, 'bot');

    var canvas = document.getElementById('field');
    field = new Field(canvas.width, canvas.height);
    field.context = canvas.getContext('2d');

    window.images = {};
    var sprites = [
        'img/tank1-down-s1.png'
      , 'img/tank1-down-s2.png'
      , 'img/tank1-up-s1.png'
      , 'img/tank1-up-s2.png'
      , 'img/tank1-right-s1.png'
      , 'img/tank1-right-s2.png'
      , 'img/tank1-left-s1.png'
      , 'img/tank1-left-s2.png'
      , 'img/normal-bot-down-s1.png'
      , 'img/normal-bot-down-s2.png'
      , 'img/normal-bot-down-s1-blink.png'
      , 'img/normal-bot-down-s2-blink.png'
      , 'img/normal-bot-up-s1.png'
      , 'img/normal-bot-up-s2.png'
      , 'img/normal-bot-up-s1-blink.png'
      , 'img/normal-bot-up-s2-blink.png'
      , 'img/normal-bot-right-s1.png'
      , 'img/normal-bot-right-s2.png'
      , 'img/normal-bot-right-s1-blink.png'
      , 'img/normal-bot-right-s2-blink.png'
      , 'img/normal-bot-left-s1.png'
      , 'img/normal-bot-left-s2.png'
      , 'img/normal-bot-left-s1-blink.png'
      , 'img/normal-bot-left-s2-blink.png'
      , 'img/fast-bullet-bot-down-s1.png'
      , 'img/fast-bullet-bot-down-s2.png'
      , 'img/fast-bullet-bot-down-s1-blink.png'
      , 'img/fast-bullet-bot-down-s2-blink.png'
      , 'img/fast-bullet-bot-up-s1.png'
      , 'img/fast-bullet-bot-up-s2.png'
      , 'img/fast-bullet-bot-up-s1-blink.png'
      , 'img/fast-bullet-bot-up-s2-blink.png'
      , 'img/fast-bullet-bot-right-s1.png'
      , 'img/fast-bullet-bot-right-s2.png'
      , 'img/fast-bullet-bot-right-s1-blink.png'
      , 'img/fast-bullet-bot-right-s2-blink.png'
      , 'img/fast-bullet-bot-left-s1.png'
      , 'img/fast-bullet-bot-left-s2.png'
      , 'img/fast-bullet-bot-left-s1-blink.png'
      , 'img/fast-bullet-bot-left-s2-blink.png'
      , 'img/fast-bot-down-s1.png'
      , 'img/fast-bot-down-s2.png'
      , 'img/fast-bot-down-s1-blink.png'
      , 'img/fast-bot-down-s2-blink.png'
      , 'img/fast-bot-up-s1.png'
      , 'img/fast-bot-up-s2.png'
      , 'img/fast-bot-up-s1-blink.png'
      , 'img/fast-bot-up-s2-blink.png'
      , 'img/fast-bot-right-s1.png'
      , 'img/fast-bot-right-s2.png'
      , 'img/fast-bot-right-s1-blink.png'
      , 'img/fast-bot-right-s2-blink.png'
      , 'img/fast-bot-left-s1.png'
      , 'img/fast-bot-left-s2.png'
      , 'img/fast-bot-left-s1-blink.png'
      , 'img/fast-bot-left-s2-blink.png'
      , 'img/heavy-bot-down-s1.png'
      , 'img/heavy-bot-down-s2.png'
      , 'img/heavy-bot-down-s1-blink.png'
      , 'img/heavy-bot-down-s2-blink.png'
      , 'img/heavy-bot-up-s1.png'
      , 'img/heavy-bot-up-s2.png'
      , 'img/heavy-bot-up-s1-blink.png'
      , 'img/heavy-bot-up-s2-blink.png'
      , 'img/heavy-bot-right-s1.png'
      , 'img/heavy-bot-right-s2.png'
      , 'img/heavy-bot-right-s1-blink.png'
      , 'img/heavy-bot-right-s2-blink.png'
      , 'img/heavy-bot-left-s1.png'
      , 'img/heavy-bot-left-s2.png'
      , 'img/heavy-bot-left-s1-blink.png'
      , 'img/heavy-bot-left-s2-blink.png'
      , 'img/bullet-up.png'
      , 'img/bullet-down.png'
      , 'img/bullet-left.png'
      , 'img/bullet-right.png'
      , 'img/brick-wall.png'
      , 'img/black.png'
      , 'img/base.png'
      , 'img/birth1.png'
      , 'img/birth2.png'
      , 'img/steel-wall.png'
      , 'img/star.png'
      , 'img/grenade.png'
      , 'img/shovel.png'
      , 'img/trees.png'
      , 'img/water1.png'
      , 'img/water2.png'
      , 'img/hit1.png'
      , 'img/hit2.png'
      , 'img/hit3.png'
      , 'img/helmet.png'
      , 'img/live.png'
      , 'img/timer.png'
      , 'img/armored1.png'
      , 'img/armored2.png'
      , 'img/ice.png'
    ];
    for (var i in sprites) {
        images[sprites[i]] = new Image();
        images[sprites[i]].src = sprites[i];
    }

    var socket = io.connect(location.href);

    socket.on('message', function(data) {
        switch (data.type) {
            case 'init':
                if (socket.socket.transport.name == 'websocket') {
                    $('#message-connecting').hide();
                    $('#login-form').show();
                } else {
                    $('#message-connecting').text('Извините, но подключение произошло не через websocket. ' +
                        'Или ваш браузер не поддерживает websockets, или вы находитесь за прокси, ' +
                        'которая рубит websocket траффик (в будущем, когда будет поддержка websockets через ssl, ' +
                        'шанс подключиться через такие прокси будет значительно выше).');
                }
                break;
            case 'user-message':
                alert(data.message);
                break;
            case 'connected':
                $('#login').hide();
                $('#public').show();
                registry.users.setCurrent(registry.currentId = data.userId);
                $('form.message-form').submit(function(){
                    var text = $(':text', this).val();
                    if (text) {
                        socket.json.send({
                            type: 'say',
                            text: text
                        });
                    }
                    $(':text', this).val('').focus();
                    return false;
                });
                $('#create-form').submit(function(){
                    var name = $('input[name=name]', this).val();
                    if (name) {
                        socket.json.send({
                            type: 'join',
                            name: name
                        });
                    }
                    return false;
                });
                $('.premade').live('click', function(){
                    socket.json.send({
                        type: 'join',
                        name: $(this).text()
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
                        type: 'start'
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
                break;
            case 'joined':
                $('#public').hide();
                $('#premade').show();
                premade = data.premade;
                registry.premadeUsers.importItems(registry.users.items);
                registry.premadeUsers.setCurrent(registry.currentId);
                $('.level .value').text(premade.level);
                break;
            case 'unjoined':
                $('#premade').hide();
                $('#public').show();
                premade = {};
                registry.premadeUsers.clear();
                // todo sync bugs when join unjoin different premades?
                $('#premade .messages').empty();
                break;
            case 'started':
                $('#premade').hide();
                $('#game').show();
                field.animateIntervalId = setInterval(function(){field.animateStep();}, 50);
                break;
            case 'gameover':
                $('#game').hide();
                $('#premade').show();
                field.clear();
                clearInterval(field.animateIntervalId);
                registry.tankStack.clear();
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
                $('.player' + current + '-lives')
                    .text(players[i].lives + ':' + players[i].points);
                current++;
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
                var type = battleCityTypesUnserialize[data['game.botStack'][i][1/*data*/][0/*type*/]];
                obj = new (window[type])();
                obj.unserialize(data['game.botStack'][i][1/*data*/]);
                data['game.botStack'][i][1/*data*/] = obj;
            }
            registry.tankStack.updateWith(data['game.botStack']);
        }
    });
    socket.on('disconnect', function() {
        $('body').html('<h3 style="text-align: center;">Извините, подключени прервано. Перезагрузите страницу, чтобы начать заново.</h3>');
    });

    $('#login-form').submit(function(){
        socket.json.send({
            type: 'connect',
            nick: $('#login input[name=nick]').val()
        });
        return false;
    });
});
