/* REDUCER(S)

It's a good practice to define your state shape first.
Based on the state shape, multiple reducers might be defined in this file, combined and exported into a single reducer function.

*/

import * as USERTYPES from './types'
import { combineReducers } from "redux";


const initialFindState = {
    loading: false,
    users: [],
    currentuser: null,
    error: null
}

const findReducer = (state=initialFindState, action) => {
    switch (action.type) {
        case USERTYPES.FIND_ALL_START:
            return Object.assign({}, state, {
                loading: true,
            })
        case USERTYPES.FIND_ALL_SUCCESS:
            return Object.assign({}, state, {
                loading: false,
                error: null,
                users: action.payload.users
            })
        case USERTYPES.FIND_ALL_ERROR:
            return Object.assign({}, state, {
                loading: false,
                error: action.payload.error,
                users: []
            })
        case USERTYPES.FIND_BY_ID_START:
            return Object.assign({}, state, {
                loading: true,
            })
        case USERTYPES.FIND_BY_ID_SUCCESS:
            return Object.assign({}, state, {
                loading: false,
                currentUser: action.payload.currentUser
            })
        case USERTYPES.FIND_BY_ID_ERROR:
            return Object.assign({}, state, {
                loading: false,
                currentUser: null,
                error: action.payload.error
            })
        case USERTYPES.CLEAR_FIND_ERROR:
            return Object.assign({}, state, {
                error: null
            })
        default:
            return state
    }
}

const reducer = combineReducers({
    find: findReducer,
})

export default reducer