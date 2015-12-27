define(['jquery'], function($) {
    function resize()
    {
        $('#body').height($(window).height() - $('#mainmenu').height() - 1);
        $('.chat-log').height($('#body').height() - 70);
        $('.user-list').add('.premades').height($('#body').height() - 18 * 3);
        $('#tabs-help').add('#tabs-editor').height($('#bot-editor').height() - $('#bot-editor .ui-tabs-nav').height() - 1);

        var cellMargin = 18; // line-height
        var columns = 12;
        for (var i = 1 ; i <= columns ; i++) {
            var cellWidth = ($('#body').width() - 1 /*just in case*/ - (columns + 1) * cellMargin) / columns;
            $('.cell-' + i).width(cellWidth * i + (i - 1) * cellMargin);
            $('.cell-' + i + 'w').width(cellWidth * i + (i - 1) * cellMargin);
        }

        if (window.location.hash == '#grid') {
            showGrid(cellMargin, columns);
        }
    }

    $(window).resize(function(){
        setTimeout(resize, 200);
    });

    function showGrid(cellMargin, columns) {
        $('.line').remove();
        var cellWidth = ($('#body').width() - 1 /*just in case*/ - (columns + 1) * cellMargin) / columns;
        for (var i = 0 ; i <= columns ; i++) {
            if (i < columns) {
                var div = $('<div class="line"></div>');
                div.css('position', 'fixed');
                div.css('top', '0');
                div.css('left', (i * cellWidth + (i + 1) * cellMargin - 0.5) + 'px');
                div.css('width', '1px');
                div.css('height', '100%');
                div.css('opacity', 0.4);
                $('body').append(div);
            }
            if (i > 0) {
                var div = $('<div class="line"></div>');
                div.css('position', 'fixed');
                div.css('top', '0');
                div.css('left', (i * cellWidth + i * cellMargin - 0.5) + 'px');
                div.css('width', '1px');
                div.css('height', '100%');
                div.css('opacity', 0.4);
                $('body').append(div);
            }
            if (i < columns) {
                for (var j = 1 ; j < 5 ; j++) {
                    var div = $('<div class="line"></div>');
                    div.css('position', 'fixed');
                    div.css('top', '0');
                    div.css('left', (i * cellWidth + (i + 1 + j) * cellMargin - 0.5) + 'px');
                    div.css('width', '1px');
                    div.css('height', '100%');
                    div.css('opacity', 0.1);
                    $('body').append(div);
                }
            }
        }

        for (var i = 1 ; i <= 30 ; i++) {
            var div = $('<div class="line"></div>');
            div.css('position', 'absolute');
            div.css('left', '0');
            div.css('top', (i * cellMargin) + 'px');
            div.css('height', '1px');
            div.css('width', '100%');
            div.css('opacity', 0.2);
            $('body').append(div);
        }
    }
});