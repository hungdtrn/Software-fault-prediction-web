/* REDUCER(S)

It's a good practice to define your state shape first.
Based on the state shape, multiple reducers might be defined in this file, combined and exported into a single reducer function.

*/

import { login, loginError, loginSuccess } from './actions'
import * as LOGINTYPES from './types'

let initialState = {
    loading: false,
    accessToken: null,
    error: null,
}

const loginReducer = (state, action) => {
    switch (action.type) {
        case LOGINTYPES.LOGIN_START: {
            return Object.assign({}, state, {
                loading: true,
                accessToken: null,
                error: null
            })
        }
        case LOGINTYPES.LOGIN_SUCCESS: {
            const { accessToken, remember } = action.payload
            
            if (remember) {
                localStorage.setItem("accessToken", accessToken)
            } else {
                sessionStorage.setItem("accessToken", accessToken)
            }

            return Object.assign({}, state, {
                error: null,
                loading: false,
                accessToken
            })
        }
        case LOGINTYPES.LOGIN_ERROR: {
            const { error } = action.payload
            console.log(error)
            return Object.assign({}, state, {
                error,
                loading: false,
                accessToken: null
            })
        }
        case LOGINTYPES.LOGIN_CLEAR_ERROR: {
            return Object.assign({}, state, {
                error: null
            })
        }
        default:
            return initialState
    }
}

export {
    loginReducer
}