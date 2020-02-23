/* OPERATIONS = REDUX SAGAS

This file defines the public interface of the duck -- what can be dispatched from components
Simple operations are just about forwarding an action creator, ex: simpleQuack
Complex operations involve returning a thunk that dispatches multiple actions in a certain order, ex: complexQuack

*/

import { call, put, race, delay, takeEvery } from 'redux-saga/effects'

import * as registerActions from './actions'
import * as registerTypes from './types'
import { CONFIG } from '../../globals'
import * as apis from "./apis"

function* register(action) { 
    try {
        yield put(registerActions.registerStart())
        
        const { response, timeout } = yield race({
            response: call(apis.register, action.payload.user),
            timeout: delay(CONFIG.REQUEST_TIMEOUT)
        });

        if (timeout) {
            yield put(registerActions.registerError("Timeout"))
        } else if(response.result) {
            yield put(registerActions.registerSuccess(response.result))
        } else {
            yield put(registerActions.registerError(response.msg))
        }
    } catch(err) {
        if (err.hasOwnProperty("response")) {
            yield put(registerActions.registerError(err.response.msg))
        } else {
            yield put(registerActions.registerError(err.toString()))
        }
    }
}

export default function* registerSaga() {
    yield takeEvery(registerTypes.REGISTER_REQUEST, register )
}

export {
    register 
}