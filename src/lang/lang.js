
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
        $(this).html(window.availableLangs[lang][$(this).attr('key')]);
    });
    $('.lang-select li.current').removeClass('current');
    $('.lang-select li[lang=' + lang + ']').addClass('current');
}

$(function(){
    applyLang('ru');
});