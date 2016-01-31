import React from 'react';
import ReactDom from 'react-dom';
import { createStore } from 'redux';
import { Menu, LoginForm } from 'src/ui/widgets';
import Odb from 'src/engine/store/odb';
import BcClient from 'src/client/bc-client';
import {PageLogin} from 'src/ui/pages';

const WEBSOCKET_SUPPORTED = !(typeof WebSocket == 'undefined' && typeof MozWebSocket == 'undefined');

// substitute ws.
var wsDomain = (location.hostname == 'localhost' ? '' : 'ws.')
    + location.hostname
    + (location.port ? ':' + location.port : '');

var socket = io(wsDomain, {
    transports: ['websocket'],
    autoConnect: false,
    reconnection: false // todo learn reconnection abilities
});

Odb.instance(new Odb(socket));
var bcClient = new BcClient(socket);

var defaultState = {
    page: new PageLogin(),
    lang: 'ru'
};

var store = createStore((state = defaultState, action) => {
    switch (action.type) {
        case 'CONNECTING':
            socket.connect();
            return Object.assign({}, state, {state: action.type});
        case 'CONNECTED':
            return Object.assign({}, state, {state: action.type});
        case 'SET_LANG':
            return Object.assign({}, state, {lang: action.lang});
        default:
            return state;
    }
});

socket.on('connect', () => store.dispatch({type: 'CONNECTED'}));
socket.connect();

function App({state}) {
    if (!WEBSOCKET_SUPPORTED) {
        return <div><Lang lang={state.lang} str="lack-of-websocket-support" /></div>;
    }

    return <div>
        <Menu
            lang={state.lang}
            setLang={lang => store.dispatch({type: 'SET_LANG', lang})}
        />
        <LoginForm lang={state.lang} />
    </div>;
}

function render()
{
    ReactDom.render(<App state={store.getState()} />, document.getElementById('root'));
}

store.subscribe(render);
store.dispatch({type: 'CONNECTING'});
