var $ = require('jquery');

window.availableLangs = {};
window.lang = {current: null};

function applyLang(lang, context, recursive)
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
        var file = $(this).attr('langfile') ? $(this).attr('langfile') : '/src/lang/';
        if (file == 'null') {
            return;
        }
        if (!recursive && (!window.availableLangs[file] || !window.availableLangs[file][lang])) {
            $.getScript(file + lang + '.js', function(){
                applyLang(lang, context, true);
            });
        } else {
            try { // if 'file' or 'lang' still not exists
                if (window.availableLangs[file][lang][key]) {
                    $(this).html(window.availableLangs[file][lang][key]);
                } else {
                    console.log('Unknown lang key "' + file + '", "' + lang + '", "' + key + '"');
                }
            } catch (ex) {
                console.log('Unknown lang key "' + file + '", "' + lang + '", "' + key + '"');
            }
            var onlang = $(this).attr('onlang');
            if (onlang) {
                eval(onlang + '(this)');
            }
        }
    });
    $('.lang-select li.current').removeClass('current');
    $('.lang-select li[lang=' + lang + ']').addClass('current');
}

$(function(){
    applyLang('ru');
});

module.exports = {
    applyLang: applyLang
};
