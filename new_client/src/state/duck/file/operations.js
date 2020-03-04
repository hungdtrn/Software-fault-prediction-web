/* OPERATIONS = REDUX SAGAS

This file defines the public interface of the duck -- what can be dispatched from components
Simple operations are just about forwarding an action creator, ex: simpleQuack
Complex operations involve returning a thunk that dispatches multiple actions in a certain order, ex: complexQuack

*/

import { call, put, race, delay, takeEvery } from 'redux-saga/effects'

import * as fileActions from './actions'
import * as fileTypes from './types'
import { CONFIG } from '../../globals'
import * as apis from "./apis"

function* findById(action) {
    try {
        yield put(fileActions.findByIdStart())

        const { response, timeout } = yield race({
            response: call(apis.findById, action.payload.id, action.payload.projectId),
            timeout: delay(CONFIG.REQUEST_TIMEOUT)
        })

        if (timeout) {
            yield put(fileActions.findByIdError("Timeout"))
        } else if (response.result) {
            yield put(fileActions.findByIdSuccess(response.result))
        } else {
            yield put(fileActions.findByIdError(response.msg))
        }
    } catch (err) {
        if (err.hasOwnProperty("response")) {
            yield put(fileActions.findByIdError(err.response.msg))
        } else {
            yield put(fileActions.findByIdError(err.toString()))
        }
    }
}

function* predictById(action) {
    try {
        yield put(fileActions.predictByIdStart())

        const { response, timeout } = yield race({
            response: call(apis.predictById, action.payload.id, action.payload.modelId),
            timeout: delay(CONFIG.REQUEST_TIMEOUT)
        })

        if (timeout) {
            yield put(fileActions.predictByIdError("Timeout"))
        } else if (response.result) {
            yield put(fileActions.predictByIdSuccess(response.result))
        } else {
            yield put(fileActions.predictByIdError(response.msg))
        }
    } catch (err) {
        if (err.hasOwnProperty("response")) {
            yield put(fileActions.predictByIdError(err.response.msg))
        } else {
            yield put(fileActions.predictByIdError(err.toString()))
        }
    }

}

export default function* fileSaga() {
    yield takeEvery(fileTypes.FIND_BY_ID_REQUEST, findById)
    yield takeEvery(fileTypes.PREDICT_BY_ID_REQUEST, predictById)
}

export {
    findById,
    predictById
}