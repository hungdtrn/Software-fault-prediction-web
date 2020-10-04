/* OPERATIONS = REDUX SAGAS

This file defines the public interface of the duck -- what can be dispatched from components
Simple operations are just about forwarding an action creator, ex: simpleQuack
Complex operations involve returning a thunk that dispatches multiple actions in a certain order, ex: complexQuack

*/

import { call, put, race, delay, takeEvery } from 'redux-saga/effects'

import * as loginActions from './actions'
import * as loginTypes from './types'
import { CONFIG } from '../../globals'
import * as apis from "./apis"

function* login(action) { 
    try {
        yield put(loginActions.loginStart())
        
        const { response, timeout } = yield race({
            response: call(apis.login, action.payload.user),
            timeout: delay(CONFIG.REQUEST_TIMEOUT)
        });

        if (timeout) {
            yield put(loginActions.loginError("Timeout"))
        } else if(response.result) {
            yield put(loginActions.loginSuccess(response.result, action.payload.remember))
        } else {
            yield put(loginActions.loginError(response.msg))
        }
    } catch(err) {
        if (err.hasOwnProperty("response")) {
            yield put(loginActions.loginError(err.response.msg))
        } else {
            yield put(loginActions.loginError(err.toString()))
        }
    }
}

export default function* loginSaga() {
    yield takeEvery(loginTypes.LOGIN_REQUEST, login)
}

export {
    login
}