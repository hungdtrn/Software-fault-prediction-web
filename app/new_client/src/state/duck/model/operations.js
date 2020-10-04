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

function* findById(action) {
    try {
        yield put(modelActions.findByIdStart())

        const { response, timeout } = yield race({
            response: call(apis.findById, action.payload.id),
            timeout: delay(CONFIG.REQUEST_TIMEOUT)
        })

        if (timeout) {
            yield put(modelActions.findByIdError("Timeout"))
        } else if (response.result) {
            yield put(modelActions.findByIdSuccess(response.result))
        } else {
            yield put(modelActions.findByIdError(response.msg))
        }
    } catch (err) {
        if (err.hasOwnProperty("response")) {
            yield put(modelActions.findByIdError(err.response.msg))
        } else {
            yield put(modelActions.findByIdError(err.toString()))
        }
    }
}

function* create(action) {
    try {
        yield put(modelActions.createStart())

        const { response, timeout } = yield race({
            response: call(apis.create, action.payload.model),
            timeout: delay(CONFIG.REQUEST_TIMEOUT)
        })

        if (timeout) {
            yield put(modelActions.createError("Timeout"))
        } else if (response.result) {
            yield put(modelActions.createSuccess(response.result))
        } else {
            yield put(modelActions.createError(response.msg))
        }
    } catch (err) {
        if (err.hasOwnProperty("response")) {
            yield put(modelActions.createError(err.response.msg))
        } else {
            yield put(modelActions.createError(err.toString()))
        }
    }
}

function* deleteById(action) {
    try {
        yield put(modelActions.deleteStart())

        const { response, timeout } = yield race({
            response: call(apis.deleteById, action.payload.id),
            timeout: delay(CONFIG.REQUEST_TIMEOUT)
        })

        if (timeout) {
            yield put(modelActions.deleteError("Timeout"))
        } else if (response.result) {
            yield put(modelActions.deleteSuccess(response.result))
        } else {
            yield put(modelActions.deleteError(response.msg))
        }
    } catch (err) {
        if (err.hasOwnProperty("response")) {
            yield put(modelActions.deleteError(err.response.msg))
        } else {
            yield put(modelActions.deleteError(err.toString()))
        }
    }
}


export default function* modelSaga() {
    yield takeEvery(modelTypes.FIND_ALL_REQUEST, findAll)
    yield takeEvery(modelTypes.FIND_BY_ID_REQUEST, findById)
    yield takeEvery(modelTypes.CREATE_REQUEST, create)
    yield takeEvery(modelTypes.DELETE_REQUEST, deleteById)
}

export {
    findAll,
    findById,
    create,
    deleteById
}