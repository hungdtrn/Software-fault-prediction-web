import { call, put, race, delay, takeEvery } from 'redux-saga/effects'

import apis from './apis'
import { ACTIONTYPES } from './actions'
import CONFIG from '../../app/config'

function* login(action) {
    try {

        const { responseJson, timeout } = yield race({
            responseJson: call(apis.login, action.payload.user),
            timeout: delay(CONFIG.REQUEST_TIMEOUT)
        })
        if (timeout) {
            yield put({
                type: ACTIONTYPES.LOGIN_ERROR,
                error: "Timeout"
            })
        }
        else if (responseJson.result) {
            yield put({ type: ACTIONTYPES.LOGIN_SUCCESS, payload: {
                accessToken: responseJson.result,
                remember: action.payload.remember
            } })    
        } else {
            yield put({ type: ACTIONTYPES.LOGIN_ERROR, payload: {
                error: responseJson.msg
            } })
        }
    } catch (err) {
        console.warn(XMLHttpRequest.responseText)        
        yield put({ type: ACTIONTYPES.LOGIN_ERROR, payload: {
            error: err
        } })
    }
}

function* register(action) {
    try {
        const { responseJson, timeout } = yield race({
            responseJson: call(apis.register, action.payload.user),
            timeout: delay(CONFIG.REQUEST_TIMEOUT)
        })
        if (timeout) {
            yield put({
                type: ACTIONTYPES.REGISTER_ERROR,
                error: "Timeout"
            })
        }
        else if (responseJson.result) {
            yield put({ type: ACTIONTYPES.REGISTER_SUCCESS, payload: {
                accessToken: responseJson.result
            } })    
        } else {
            yield put({ type: ACTIONTYPES.REGISTER_ERROR, payload: {
                error: responseJson.msg
            } })
        }
    } catch (err) {
        yield put({ type: ACTIONTYPES.REGISTER_ERROR, payload: {
            error: err
        } })
    }
}


export default function* authSaga() {
    yield takeEvery(ACTIONTYPES.REQUEST_LOGIN, login)
    yield takeEvery(ACTIONTYPES.REQUEST_REGISTER, register)
}