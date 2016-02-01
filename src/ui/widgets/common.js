var $ = require('jquery');
import { Lang } from 'src/lang/lang';
var Premade = require('src/common/premade.js');
import React from 'react';

export { WidgetLevelSelector, UserPoint, CreateGame, LoginForm, WidgetLangSelector };

//====== WidgetLevelSelector ===================================================

function WidgetLevelSelector(context, client)
{
    client.currentPremade.on('change', function() {
        // "this" is client.currentPremade
        var levelSelect = $('select', context);
        levelSelect.empty();
        for (var i = 1; i <= Premade.maxLevels; i++) {
            levelSelect.append($('<option value="' + i + '">' + i + '</option>'));
        }
        levelSelect.val(this.level);
    });
}

//====== UserPoint =============================================================

function UserPoint(premadeUsers)
{
    premadeUsers.on('add', this.onChange.bind(this));
    premadeUsers.on('change', this.onChange.bind(this));
    premadeUsers.on('remove', this.onRemove.bind(this));
}

UserPoint.prototype.onChange = function(user)
{
    $('.player' + user.positionId + '-stats').text(user.lives + ':' + user.points);
};

UserPoint.prototype.onRemove = function(user)
{
    $('.player' + user.positionId + '-stats').text('');
};

//====== CreateGame ======================================================

function CreateGame({ client })
{
    var input;
    function submit(e) {
        e.preventDefault();
        input.value && client.join(input.value);
    }

    return <div>
        <h1 className="cell-6"><Lang str="header-create-game" /></h1>
        <form className="cell-6 clear" onSubmit={submit}>
            <div className="top-margin">
                <Lang str="enter-new-game-name" />
                <input type="text" name="name" ref={c => input = c} />
                <button type="submit"><Lang str="submit-create" /></button>
            </div>
        </form>
    </div>;
}

//====== LoginForm =======================================================

function LoginForm({ client })
{
    var nick;
    function submit(e) {
        e.preventDefault();
        client.login(nick.value, function() {
            window.uiManager.setStatePublic();
        });
    }

    return <div>
        <div className="login">
            <div className="cell-12 leftmost">
                <h2>FAQ:</h2>
                <ul className="faq">
                    <li>Управление: Стрелки - ездить, пробел - стрелять.</li>
                </ul>
            </div>
            <form id="game-login" className="cell-12 leftmost" onSubmit={submit}>
                <fieldset>
                    <legend><Lang str="legend-play" /></legend>
                    <div>
                        <Lang str="enter-nick" />
                        <input type="text" name="nick" ref={(c) => nick = c} />
                    </div>
                    <div className="submit">
                        <button type="submit"><Lang str="submit-play" /></button>
                    </div>
                </fieldset>
            </form>
        </div>

        <div id="credits">
            <a className="span" href="http://www.spriters-resource.com/nes/batcity/sheet/11756">Sprites by Zephiel87</a>
            <a className="span" href="https://github.com/vtk13/battle-city-js">Source code by vtk</a>
        </div>
    </div>;
}

//====== WidgetLangSelector ====================================================

function WidgetLangSelector()
{
    $('.lang-select li').click(function(){
        lang.applyLang($(this).attr('lang'));
    });
}
