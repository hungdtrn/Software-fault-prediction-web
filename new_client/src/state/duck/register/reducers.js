/* REDUCER(S)

It's a good practice to define your state shape first.
Based on the state shape, multiple reducers might be defined in this file, combined and exported into a single reducer function.

*/

import * as REGISTERTYPES from './types'

let initialState = {
    loading: false,
    success: false,
    error: null,
}

const registerReducer = (state, action) => {
    switch (action.type) {
        case REGISTERTYPES.REGISTER_START: {
            return Object.assign({}, state, {
                loading: true,
                success: false,
                error: null
            })
        }
        case REGISTERTYPES.REGISTER_SUCCESS: {
            const { accessToken } = action.payload
            

            return Object.assign({}, state, {
                error: null,
                loading: false,
                success: true,
            })
        }
        case REGISTERTYPES.REGISTER_ERROR: {
            const { error } = action.payload

            return Object.assign({}, state, {
                error,
                loading: false,
                success: false
            })
        }
        case REGISTERTYPES.REGISTER_CLEAR_ERROR: {
            return Object.assign({}, state, {
                error: null
            })
        }
        default:
            return initialState
    }
}

export {
    registerReducer
}