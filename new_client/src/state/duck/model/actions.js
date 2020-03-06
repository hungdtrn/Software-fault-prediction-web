/* ACTION CREATOR FUNCTIONS
Put here the functions that return an action object that can be dispatched
HINT: Always use functions for consistency, don't export plain objects
*/

import * as types from './types'

const findAllRequest = ( ) => ({
    type: types.FIND_ALL_REQUEST,
})

const findAllStart = ( ) => ({
    type: types.FIND_ALL_START
})

const findAllSuccess = ( models ) => ({
    type: types.FIND_ALL_SUCCESS,
    payload: {
        models
    }
})

const findAllError = ( error ) => ({
    type: types.FIND_ALL_ERROR,
    payload: {
        error
    }
})

const clearFindError = ( ) => ({
    type: types.CLEAR_FIND_ERROR
})

const findByIdRequest = ( id ) => ({
    type: types.FIND_BY_ID_REQUEST,
    payload: {
        id
    }
})

const findByIdStart = () => ({
    type: types.FIND_BY_ID_START
})

const findByIdError = ( error ) => ({
    type: types.FIND_BY_ID_ERROR,
    payload: {
        error
    }
})

const findByIdSuccess = ( currentModel ) => ({
    type: types.FIND_BY_ID_SUCCESS,
    payload: {
        currentModel
    }
})

const clearFindById = ( ) => ({
    type: types.CLEAR_FIND_BY_ID
})

const createRequest = ( model ) => ({
    type: types.CREATE_REQUEST,
    payload: {
        model
    }
})

const createStart = ( ) => ({
    type: types.CREATE_START
})

const createError = ( error ) => ({
    type: types.CREATE_ERROR,
    payload: {
        error
    }
})

const createSuccess = ( createdModel ) => ({
    type: types.CREATE_SUCCESS,
    payload: {
        createdModel
    }
})

const clearCreate = ( ) => ({
    type: types.CLEAR_CREATE
})

const deleteByIdRequest = ( id ) => ({
    type: types.DELETE_REQUEST,
    payload: {
        id
    }
})

const deleteStart = ( ) => ({
    type: types.DELETE_START
})

const deleteError = ( error ) => ({
    type: types.DELETE_ERROR,
    payload: {
        error
    }
})

const deleteSuccess = ( deletedId ) => ({
    type: types.DELETE_SUCCESS,
    payload: {
        deletedId
    }
})

const clearDelete = ( ) => ({
    type: types.CLEAR_DELETE
})

export {
    findAllRequest,
    findAllStart,
    findAllError,
    findAllSuccess,
    clearFindError,

    findByIdRequest,
    findByIdStart,
    findByIdError,
    findByIdSuccess,
    clearFindById,

    createRequest,
    createStart,
    createError,
    createSuccess,
    clearCreate,

    deleteByIdRequest,
    deleteStart,
    deleteError,
    deleteSuccess,
    clearDelete,
}