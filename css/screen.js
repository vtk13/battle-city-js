
$(window).resize(function(){
    $('.chat-log').height($(this).height() - 70);
    $('#bot-editor').height($(this).height() - $('#game').height());
    $('#bot-editor #editor').height($('#bot-editor').height()-2).width($('#bot-editor').width()-2);
});
