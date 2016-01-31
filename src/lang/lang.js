import ru from 'src/lang/ru';
import en from 'src/lang/en';

export default translate;

var translations = {ru, en};

function translate(lang, str) {
    return translations[lang][str];
}
