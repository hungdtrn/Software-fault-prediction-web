/**
 * app.js
 *
 * This is the entry file for the application, only setup and boilerplate
 * code.
 */


// Needed for redux-saga es6 generator support
import '@babel/polyfill';

// Import all third party stuff
import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './app';
import configureStore from './store'
import { Provider } from 'react-redux'
import { ConnectedRouter } from 'connected-react-router'
import * as serviceWorker from './serviceWorker';
import history from 'utils/history';

const initalState = {}
const store = configureStore(initalState, history)

ReactDOM.render(
    <Provider store={store}>
        <ConnectedRouter history={history}>
            <App />
        </ConnectedRouter>
    </Provider>
    , document.getElementById('root'));

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
