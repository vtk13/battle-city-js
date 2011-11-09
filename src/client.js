
var registry, field, premade = {};

Field.prototype.draw = function()
{
    this.context.fillStyle = 'rgba(0, 0, 0, 1)';
    this.context.fillRect(0, 0, this.width, this.height);
    for (var z = 0 ; z <= 2 ; z++) {
        this.objects.forEach(function(current){
            if (current.z == z) {
                for (var i in current.img) {
                    this.context.drawImage(images[current.img[i]],
                            current.x - current.hw,
                            current.y - current.hh);
                }
            }
        }, this);
    }
};

function isClient()
{
    return true;
};

$(function() {
    registry = {
        users: new TUserList($('#public .user-list'), undefined, 'user'),
        // todo move to premade object
        premadeUsers: new TUserList($('#premade .user-list'), function(user) {
            return user.premadeId == premade.id;
        }, 'user'),
        tankStack: new TTankStack($('#game #bot-stack'), undefined, 'bot')
    };

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

    $('.login-form').submit(function(){
        var socket = io.connect(location.href);

        socket.on('connect', function() {
            console.log(socket.socket.transport.name);
            socket.json.send({
                type: 'connect',
                nick: $('#login input[name=nick]').val()
            });
        });
        socket.on('message', function(data) {
            switch (data.type) {
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
                    registry.premadeUsers.import(registry.users.items);
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
                case 'sync':
                    if (data['users']) {
                        registry.users.updateWith(data['users']);
                    }
                    if (data['messages']) {
                        data.messages.forEach(function(event) {
                            if (event.type == 'add') {
                                var date = new Date(event.data.time);
                                var time = date.getHours() + ':' + (date.getMinutes() < 10 ? 0 : '') + date.getMinutes();
                                $('#public .messages').append('<div><span>' +
                                        time + '</span> ' +
                                        '<span>&lt;' + event.data.nick + '&gt;</span> ' +
                                        event.data.text + '</div>');
                                $('#public .messages').get(0).scrollTop = $('#public .messages').get(0).scrollHeight;
                            }
                        });
                    }
                    if (data['premades']) {
                        data['premades'].forEach(function(event) {
                            switch (event.type) {
                            case 'add':
                            case 'change':
                                if (event.data.id == premade.id) {
                                    premade = event.data;
                                    $('.level .value').text(premade.level);
                                }
                                if ($('#public .premades .premade' + event.data.id).size() > 0) {
                                    $('#public .premades .premade' + event.data.id).html(event.data.name);
                                } else {
                                    $('#public .premades').append($('<div class="premade premade' +
                                        event.data.id + '">' +
                                        event.data.name + '</div>'));
                                }
                                break;
                            case 'remove':
                                $('#public .premades .premade' + event.data.id).remove();
                                break;
                            }
                        });
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
                        data['premade.messages'].forEach(function(event) {
                            if (event.type == 'add') {
                                var date = new Date(event.data.time);
                                var time = date.getHours() + ':' + (date.getMinutes() < 10 ? 0 : '') + date.getMinutes();
                                $('#premade .messages').append('<div><span>' +
                                        time + '</span> ' +
                                        '<span>&lt;' + event.data.nick + '&gt;</span> ' +
                                        event.data.text + '</div>');
                                $('#premade .messages').get(0).scrollTop = $('#premade .messages').get(0).scrollHeight;
                            }
                        });
                    }
                    if (data['field.objects']) {
                        field.updateWith(data['field.objects']);
                    }
                    if (data['game.botStack']) {
                        registry.tankStack.updateWith(data['game.botStack']);
                    }
                    break;
            }
        });
        socket.on('disconnect', function() {
            console.log('disconnect');
        });
        return false;
    });
});
