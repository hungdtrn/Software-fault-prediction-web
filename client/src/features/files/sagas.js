import { call, put, race ,delay, takeEvery } from 'redux-saga/effects'

import apis from './apis'
import { ACTIONTYPES } from './actions'
import CONFIG from '../../app/config'

function *findById(action) {
    try {
        yield put({
            type: ACTIONTYPES.FIND_BY_ID_BEGIN
        })
        const { responseJson, timeout } = yield race({
            responseJson: call(apis.findById, action.payload.id, action.payload.projectId),
            timeout: delay(CONFIG.REQUEST_TIMEOUT)
        })
        if (timeout) {
            yield put({
                type: ACTIONTYPES.FIND_BY_ID_ERROR,
                error: "Timeout"
            })
        } else if (responseJson.result) {
            yield put({ type: ACTIONTYPES.FIND_BY_ID_SUCCESS, payload: {
                selectedFile: responseJson.result
            }})
        } else {
            yield put({ type: ACTIONTYPES.FIND_BY_ID_ERROR, payload: {
                error: responseJson.msg
            } })
        }
    } catch(err) {
        yield put({ type: ACTIONTYPES.FIND_BY_ID_ERROR, payload: {
            error: err
        }})
    }
}

export default function* fileSaga() {
    yield takeEvery(ACTIONTYPES.REQUEST_FIND_BY_ID, findById)
}