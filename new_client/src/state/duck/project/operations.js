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

function* findAll(action) {
    return
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