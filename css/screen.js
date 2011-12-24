
$(window).resize(function(){
    $('#body').height($(this).height() - $('#mainmenu').height() - 1);
    $('.chat-log').height($('#body').height() - 70);
    $('#help').height($('#body').height() - $('#game').height());
//    $('#bot-editor #editor').height($('#bot-editor').height()-2).width($('#bot-editor').width()-2);
});
