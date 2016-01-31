import React from 'react';
import ReactDom from 'react-dom';
import translate from 'src/lang/lang';

export {Menu, LoginForm};

function Lang({lang, str}) {
    return <span dangerouslySetInnerHTML={{__html: translate(lang, str)}} />;
}

function LangSelector({lang, setLang})
{
    return (
        <ul className="lang-select">
            <li lang="en" onClick={() => setLang('en')} className={lang == 'en' ? 'current' : ''}>en</li>
            <li lang="ru" onClick={() => setLang('ru')} className={lang == 'ru' ? 'current' : ''}>ru</li>
        </ul>
    );
}

function Menu({lang, setLang}) {
    return <div id="mainmenu"><LangSelector lang={lang} setLang={setLang} /></div>;
}

function LoginForm({lang}) {
    return (
        <div className="login">
            <div className="cell-12 leftmost">
                <h2>FAQ:</h2>
                <ul className="faq">
                    <li>Управление: Стрелки - ездить, пробел - стрелять.</li>
                </ul>
            </div>
            <form id="game-login" className="cell-12 leftmost">
                <fieldset>
                    <legend><Lang lang={lang} str="legend-play" /></legend>
                    <div>
                        <Lang lang={lang} str="enter-nick" />
                        <input type="text" name="nick" title="" autofocus />
                    </div>
                    <div className="submit">
                        <button type="submit"><Lang lang={lang} str="submit-play" /></button>
                    </div>
                </fieldset>
            </form>
        </div>
    );
}
