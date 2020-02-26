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
            yield put(loginActions.loginError(err.response.msg))
        } else {
            yield put(loginActions.loginError(err.toString()))
        }
    }
}

function* findById(action) {
    return
}

function* create(action) {
    return
}

function* deleteById(action) {
    return
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