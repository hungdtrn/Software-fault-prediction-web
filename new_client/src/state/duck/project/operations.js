/* OPERATIONS = REDUX SAGAS

This file defines the public interface of the duck -- what can be dispatched from components
Simple operations are just about forwarding an action creator, ex: simpleQuack
Complex operations involve returning a thunk that dispatches multiple actions in a certain order, ex: complexQuack

*/

import { call, put, race, delay, takeEvery } from 'redux-saga/effects'

import * as projectActions from './actions'
import * as projectTypes from './types'
import { CONFIG } from '../../globals'
import * as apis from "./apis"

function* findAll(action) {
    try {
        yield put(projectActions.findAllStart())

        const { response, timeout } = yield race({
            response: call(apis.findAll),
            timeout: delay(CONFIG.REQUEST_TIMEOUT)
        })

        if (timeout) {
            yield put(projectActions.findAllError("Timeout"))
        } else if(response.result) {
            yield put(projectActions.findAllSuccess(response.result))
        } else {
            yield put(projectActions.findAllError(response.msg))
        }
    } catch(err) {
        if (err.hasOwnProperty("response")) {
            yield put(projectActions.findAllError(err.response.msg))
        } else {
            yield put(projectActions.findAllError(err.toString()))
        }
    }
}

function* findById(action) {
    try {
        yield put(projectActions.findByIdStart())

        const { response, timeout } = yield race({
            response: call(apis.findById, action.payload.id),
            timeout: delay(CONFIG.REQUEST_TIMEOUT)
        })

        if (timeout) {
            yield put(projectActions.findByIdError("Timeout"))
        } else if (response.result) {
            yield put(projectActions.findByIdSuccess(response.result))
        } else {
            yield put(projectActions.findByIdError(response.msg))
        }
    } catch (err) {
        if (err.hasOwnProperty("response")) {
            yield put(projectActions.findByIdError(err.response.msg))
        } else {
            yield put(projectActions.findByIdError(err.toString()))
        }
    }
}

function* create(action) {
    try {
        yield put(projectActions.createStart())

        const { response, timeout } = yield race({
            response: call(apis.create, action.payload.project),
            timeout: delay(CONFIG.REQUEST_TIMEOUT)
        })

        if (timeout) {
            yield put(projectActions.createError("Timeout"))
        } else if (response.result) {
            yield put(projectActions.createSuccess(response.result))
        } else {
            yield put(projectActions.createError(response.msg))
        }
    } catch (err) {
        if (err.hasOwnProperty("response")) {
            yield put(projectActions.createError(err.response.msg))
        } else {
            yield put(projectActions.createError(err.toString()))
        }
    }
}

function* deleteById(action) {
    try {
        yield put(projectActions.deleteStart())

        const { response, timeout } = yield race({
            response: call(apis.deleteById, action.payload.id),
            timeout: delay(CONFIG.REQUEST_TIMEOUT)
        })

        if (timeout) {
            yield put(projectActions.deleteError("Timeout"))
        } else if (response.result) {
            yield put(projectActions.deleteSuccess())
        } else {
            yield put(projectActions.deleteError(response.msg))
        }
    } catch (err) {
        if (err.hasOwnProperty("response")) {
            yield put(projectActions.deleteError(err.response.msg))
        } else {
            yield put(projectActions.deleteError(err.toString()))
        }
    }
}

export default function* projectSage() {
    return
}

export {
    findAll,
    findById,
    create,
    deleteById,
}