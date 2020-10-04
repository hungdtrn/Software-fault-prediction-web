/* ACTION CREATOR FUNCTIONS
Put here the functions that return an action object that can be dispatched
HINT: Always use functions for consistency, don't export plain objects
*/

import * as types from './types'

const loginRequest = ({ user, remember }) => ({
    type: types.LOGIN_REQUEST,
    payload: {
        user,
        remember
    }
})

const loginStart = () => ({
    type: types.LOGIN_START
})

const loginError = ( errMsg ) => ({
    type: types.LOGIN_ERROR,
    payload: {
        error: errMsg
    }
})

const loginSuccess = ( accessToken, remember ) => ({
    type: types.LOGIN_SUCCESS,
    payload: {
        accessToken,
        remember
    }
})

const logout = () => ({
    type: types.LOGOUT
})

const clearError = () => ({
    type: types.LOGIN_CLEAR_ERROR
})

export {
    loginRequest,
    loginStart,
    loginError,
    loginSuccess,
    logout,
    clearError
}