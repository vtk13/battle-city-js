
window.availableLangs = {};

function applyLang(lang)
{
    $('.lang').each(function(){
        $(this).html(window.availableLangs[lang][$(this).attr('key')]);
    });
    $('.lang-select li.current').removeClass('current');
    $('.lang-select li[lang=' + lang + ']').addClass('current');
}

$(function(){
    applyLang('ru');
});