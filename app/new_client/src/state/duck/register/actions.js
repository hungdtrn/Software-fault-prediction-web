/* ACTION CREATOR FUNCTIONS
Put here the functions that return an action object that can be dispatched
HINT: Always use functions for consistency, don't export plain objects
*/

import * as types from './types'

const registerRequest = (user) => ({
    type: types.REGISTER_REQUEST,
    payload: {
        user    
    }
})

const registerStart = () => ({
    type: types.REGISTER_START
})

const registerError = ( errMsg ) => ({
    type: types.REGISTER_ERROR,
    payload: {
        error: errMsg
    }
})

const registerSuccess = ( accessToken ) => ({
    type: types.REGISTER_SUCCESS,
    payload: {
        accessToken,
    }
})

const clearError = () => ({
    type: types.REGISTER_CLEAR_ERROR
})

export {
    registerRequest,
    registerStart,
    registerError,
    registerSuccess,
    clearError
}