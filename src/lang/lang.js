import ru from 'src/lang/ru';
import en from 'src/lang/en';

import React from 'react';

export { translate, Lang };

var translations = {ru, en};

function translate(lang, str) {
    return translations[lang][str];
}

function Lang({lang = 'ru', str})
{
    return <span>{translate(lang, str)}</span>;
}
