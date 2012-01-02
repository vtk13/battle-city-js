
window.availableLangs = {};
window.lang = {current: null};

function applyLang(lang, context)
{
    if (!lang) {
        lang = window.lang.current;
    } else {
        window.lang.current = lang;
    }

    var elements = $('.lang', context);
    if (context) {
        elements = elements.add(context.filter('.lang'));
    }

    elements.each(function(){
        var key = $(this).attr('key');
        if (window.availableLangs[lang][key]) {
            $(this).html(window.availableLangs[lang][key]);
        } else {
            console.log('Unknown lang key "' + key + '"');
        }
    });
    $('.lang-select li.current').removeClass('current');
    $('.lang-select li[lang=' + lang + ']').addClass('current');
}

$(function(){
    applyLang('ru');
});