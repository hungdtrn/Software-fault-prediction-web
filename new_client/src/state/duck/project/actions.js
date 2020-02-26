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

const findAllSuccess = (projects) => ({
    type: types.FIND_ALL_SUCCESS,
    payload: {
        projects
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

const findByIdSuccess = ( project ) => ({
    type: types.FIND_BY_ID_SUCCESS,
    payload: {
        currentProject: project
    }
})

const findByIdError = ( error ) => ({
    type: types.FIND_BY_ID_ERROR,
    payload: {
        error
    }
})

const createRequest = ( project ) => ({
    type: types.CREATE_REQUEST,
    payload: {
        project
    }
})

const createStart = ( ) => ({
    type: types.CREATE_START
})

const createSuccess = ( createdProject ) => ({
    type: types.CREATE_SUCCESS,
    payload: {
        createdProject
    }
})

const createError = ( error ) => ({
    type: types.CREATE_ERROR,
    payload: {
        error
    }
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

const deleteSuccess = ( ) => ({
    type: types.DELETE_SUCCESS
})

const deleteError = ( error ) => ({
    type: types.DELETE_ERROR,
    payload: {
        error
    }
})


export {
    findAllRequest,
    findAllStart,
    findAllSuccess,
    findAllError,

    findByIdRequest,
    findByIdStart,
    findByIdSuccess,
    findByIdError,

    createRequest,
    createStart,
    createSuccess,
    createError,

    deleteRequest,
    deleteStart,
    deleteSuccess,
    deleteError,
}