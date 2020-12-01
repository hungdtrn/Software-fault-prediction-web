/* OPERATIONS = REDUX SAGAS

This file defines the public interface of the duck -- what can be dispatched from components
Simple operations are just about forwarding an action creator, ex: simpleQuack
Complex operations involve returning a thunk that dispatches multiple actions in a certain order, ex: complexQuack

*/

import { call, put, race, delay, takeEvery } from 'redux-saga/effects'

import * as userActions from './actions'
import * as userTypes from './types'
import { CONFIG } from '../../globals'
import * as apis from "./apis"

function* findAll(action) {
    try {
        yield put(userActions.findAllStart())

        const { response, timeout } = yield race({
            response: call(apis.findAll),
            timeout: delay(CONFIG.REQUEST_TIMEOUT)
        })

        if (timeout) {
            yield put(userActions.findAllError("Timeout"))
        } else if(response.result) {
            yield put(userActions.findAllSuccess(response.result))
        } else {
            yield put(userActions.findAllError(response.msg))
        }
    } catch(err) {
        if (err.hasOwnProperty("response")) {
            yield put(userActions.findAllError(err.response.msg))
        } else {
            yield put(userActions.findAllError(err.toString()))
        }
    }
}

function* findById(action) {
    try {
        yield put(userActions.findByIdStart())

        const { response, timeout } = yield race({
            response: call(apis.findById, action.payload.id),
            timeout: delay(CONFIG.REQUEST_TIMEOUT)
        })

        if (timeout) {
            yield put(userActions.findByIdError("Timeout"))
        } else if (response.result) {
            yield put(userActions.findByIdSuccess(response.result))
        } else {
            yield put(userActions.findByIdError(response.msg))
        }
    } catch (err) {
        if (err.hasOwnProperty("response")) {
            yield put(userActions.findByIdError(err.response.msg))
        } else {
            yield put(userActions.findByIdError(err.toString()))
        }
    }
}


export default function* userSage() {
    yield takeEvery(userTypes.FIND_ALL_REQUEST, findAll)
    yield takeEvery(userTypes.FIND_BY_ID_REQUEST, findById)
}

export {
    findAll,
    findById,
}