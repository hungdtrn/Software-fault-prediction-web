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

export {
    findAllRequest,
    findAllStart,
    findAllSuccess,
    findAllError,
}