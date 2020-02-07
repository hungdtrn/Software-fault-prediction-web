import { call, put, race ,delay, takeEvery } from 'redux-saga/effects'

import apis from './apis'
import { ACTIONTYPES } from './actions'
import CONFIG from '../../app/config'

function *findAll(action) {
    try {
        const { responseJson, timeout } = yield race({
            responseJson: call(apis.findAll),
            timeout: delay(CONFIG.REQUEST_TIMEOUT)
        })
        if (timeout) {
            yield put({
                type: ACTIONTYPES.FIND_ALL_ERROR,
                error: "Timeout"
            })
        } else if (responseJson.result) {
            yield put({ type: ACTIONTYPES.FIND_ALL_SUCCESS, payload: {
                projects: responseJson.result
            }})
        } else {
            yield put({ type: ACTIONTYPES.FIND_ALL_ERROR, payload: {
                error: responseJson.msg
            } })
        }
    } catch(err) {
        yield put({ type: ACTIONTYPES.FIND_ALL_ERROR, payload: {
            error: err
        }})
    }
}

function *findById(action) {
    try {
        const { responseJson, timeout } = yield race({
            responseJson: call(apis.findById, action.payload.id),
            timeout: delay(CONFIG.REQUEST_TIMEOUT)
        })
        if (timeout) {
            yield put({
                type: ACTIONTYPES.FIND_BY_ID_ERROR,
                error: "Timeout"
            })
        } else if (responseJson.result) {
            yield put({ type: ACTIONTYPES.FIND_BY_ID_SUCCESS, payload: {
                selectedProject: responseJson.result
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

function *create(action) {
    try {
        const { responseJson, timeout } = yield race({
            responseJson: call(apis.create, action.payload.project),
            timeout: delay(CONFIG.REQUEST_TIMEOUT)
        })
        console.log(responseJson)
        if (timeout) {
            yield put({
                type: ACTIONTYPES.CREATE_ERROR,
                payload: {
                    error: "timeout"
                }
            })
        } else if (responseJson.result) {
            yield put({
                type: ACTIONTYPES.CREATE_SUCCESS,
                payload: {
                    projectId: responseJson.result
                }
            })
        } else {
            yield put({
                type: ACTIONTYPES.CREATE_ERROR,
                payload: {
                    error: responseJson.msg
                }
            })
        }
    } catch(err) {
        yield put({
            type: ACTIONTYPES.CREATE_ERROR, payload: {
                error: err
            }
        })
    }
}

export default function* projectSaga() {
    yield takeEvery(ACTIONTYPES.REQUEST_FIND_ALL, findAll)
    yield takeEvery(ACTIONTYPES.REQUEST_CREATE, create)
    yield takeEvery(ACTIONTYPES.REQUEST_FIND_BY_ID, findById)
}