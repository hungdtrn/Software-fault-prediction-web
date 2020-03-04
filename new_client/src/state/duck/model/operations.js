/* OPERATIONS = REDUX SAGAS

This file defines the public interface of the duck -- what can be dispatched from components
Simple operations are just about forwarding an action creator, ex: simpleQuack
Complex operations involve returning a thunk that dispatches multiple actions in a certain order, ex: complexQuack

*/

import { call, put, race, delay, takeEvery } from 'redux-saga/effects'

import * as modelActions from './actions'
import * as modelTypes from './types'
import { CONFIG } from '../../globals'
import * as apis from "./apis"

function* findAll(action) {
    try {
        yield put(modelActions.findAllStart())

        const { response, timeout } = yield race({
            response: call(apis.findAll),
            timeout: delay(CONFIG.REQUEST_TIMEOUT)
        })

        if (timeout) {
            yield put(modelActions.findAllError("Timeout"))
        } else if (response.result) {
            yield put(modelActions.findAllSuccess(response.result))
        } else {
            yield put(modelActions.findAllError(response.msg))
        }
    } catch (err) {
        if (err.hasOwnProperty("response")) {
            yield put(modelActions.findAllError(err.response.msg))
        } else {
            yield put(modelActions.findAllError(err.toString()))
        }
    }
}

export default function* modelSaga() {
    yield takeEvery(modelTypes.FIND_ALL_REQUEST, findAll)
}

export {
    findAll,
}