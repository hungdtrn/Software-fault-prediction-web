/* ACTION CREATOR FUNCTIONS
Put here the functions that return an action object that can be dispatched
HINT: Always use functions for consistency, don't export plain objects
*/

import * as types from './types'

const findByIdRequest = ( id, projectId ) => ({
    type: types.FIND_BY_ID_REQUEST,
    payload: {
        id,
        projectId
    }
})

const findByIdStart = ( ) => ({
    type: types.FIND_BY_ID_START
})

const findByIdSuccess = ( file ) => ({
    type: types.FIND_BY_ID_SUCCESS,
    payload: {
        currentFile: file
    }
})

const findByIdError = ( error ) => ({
    type: types.FIND_BY_ID_ERROR,
    payload: {
        error
    }
})

const clearFindError = ( ) => ({
    type: types.CLEAR_FIND_ERROR
})

const predictByIdRequest = ( id, modelId ) => ({
    type: types.PREDICT_BY_ID_REQUEST,
    payload: {
        id,
        modelId
    }
})

const predictByIdStart = ( ) => ({
    type: types.PREDICT_BY_ID_START
})

const predictByIdSuccess = ( file ) => ({
    type: types.PREDICT_BY_ID_SUCCESS,
    payload: {
        updatedFile: file
    }
})

const predictByIdError = ( error ) => ({
    type: types.PREDICT_BY_ID_ERROR,
    payload: {
        error
    }
})

const clearPredictError = ( ) => ({
    type: types.CLEAR_PREDICT_ERROR
})

export {
    findByIdRequest,
    findByIdStart,
    findByIdError,
    findByIdSuccess,
    clearFindError,

    predictByIdRequest,
    predictByIdStart,
    predictByIdError,
    predictByIdSuccess,
    clearPredictError
}