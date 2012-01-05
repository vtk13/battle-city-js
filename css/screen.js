
$(window).resize(function(){
    $('#body').height($(this).height() - $('#mainmenu').height() - 1);
    $('.chat-log').height($('#body').height() - 70);
    $('#help').height($('#body').height() - $('#game').height());
//    $('#bot-editor #editor').height($('#bot-editor').height()-2).width($('#bot-editor').width()-2);
    $('.user-list').add('.premades').height($('#body').height() - 18 * 3);

    var cellMargin = 18; // line-height
    var columns = 12;
    for (var i = 1 ; i <= columns ; i++) {
        var cellWidth = ($('#body').width() - (columns + 1) * cellMargin) / columns;
        $('.cell-' + i).width(cellWidth * i + (i - 1) * cellMargin);
    }
});