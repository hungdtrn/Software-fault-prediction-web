/* ACTION CREATOR FUNCTIONS
Put here the functions that return an action object that can be dispatched
HINT: Always use functions for consistency, don't export plain objects
*/

import * as types from './types'

const findAllRequest = () => ({
    type: types.FIND_ALL_REQUEST
})

const findAllStart = () => ({
    type: types.FIND_ALL_START
})

const findAllSuccess = (users) => ({
    type: types.FIND_ALL_SUCCESS,
    payload: {
        users
    }
})

const findAllError = (error) => ({
    type: types.FIND_ALL_ERROR,
    payload: {
        error
    }
})

const findByIdRequest = ( id ) => ({
    type: types.FIND_BY_ID_REQUEST,
    payload: {
        id
    }
})

const findByIdStart = ( ) => ({
    type: types.FIND_BY_ID_START
})

const findByIdInArray = ( id ) => ({
    type: types.FIND_BY_ID_IN_ARRAY,
    payload: {
        id
    }
})

const findByIdSuccess = ( user ) => ({
    type: types.FIND_BY_ID_SUCCESS,
    payload: {
        currentUser: user
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

const createError = ( error ) => ({
    type: types.CREATE_ERROR,
    payload: {
        error
    }
})

const clearCreate = ( ) => ({
    type: types.CLEAR_CREATE
})

const deleteRequest = ( id ) => ({
    type: types.DELETE_REQUEST,
    payload: {
        id
    }
})

const deleteStart = ( ) => ({
    type: types.DELETE_START
})

const deleteSuccess = ( id ) => ({
    type: types.DELETE_SUCCESS,
    payload: {
        id
    }
})

const deleteError = ( error ) => ({
    type: types.DELETE_ERROR,
    payload: {
        error
    }
})

const clearDelete = ( ) => ({
    type: types.CLEAR_DELETE,
})


export {
    findAllRequest,
    findAllStart,
    findAllSuccess,
    findAllError,

    findByIdRequest,
    findByIdStart,
    findByIdInArray,
    findByIdSuccess,
    findByIdError,
    
    clearFindError,

    createError,
    clearCreate,

    deleteRequest,
    deleteStart,
    deleteSuccess,
    deleteError,
    clearDelete,
}