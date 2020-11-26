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

const initialCreateState = {
    loading: false,
    createdUser: null,
    error: null
}

const createReducer = (state=initialCreateState, action) => {
    switch (action.type) {
        case USERTYPES.CREATE_START:
            return Object.assign({}, state, {
                loading: true,
                error: null,
            })
        case USERTYPES.CREATE_ERROR:
            return Object.assign({}, state, {
                loading: false,
                createdUser: null,
                error: action.payload.error
            })
        case USERTYPES.CREATE_SUCCESS:
            return Object.assign({}, state, {
                loading: false,
                createdUser: action.payload.createdUser,
                error: null
            })
        case USERTYPES.CLEAR_CREATE:
            return Object.assign({}, state, {
                loading: false,
                createdUser: null,
                error: null
            })
        default:
            return state
    }
}

const initialDeleteState = {
    loading: false,
    success: false,
    error: null
}

const deleteReducer = (state=initialDeleteState, action) => {
    switch (action.type) {
        case USERTYPES.DELETE_START:
            return Object.assign({}, state, {
                loading: true,
                error: null
            })
        case USERTYPES.DELETE_ERROR:
            return Object.assign({}, state, {
                loading: false,
                success: false,
                error: action.payload.error
            })
        case USERTYPES.DELETE_SUCCESS:
            return Object.assign({}, state, {
                loading: false,
                error: null,
                success: true,
            })
        case USERTYPES.CLEAR_DELETE:
            return Object.assign({}, state, {
                loading: false,
                success: false,
                error: null
            })
        default:
            return state;
    }
}

const reducer = combineReducers({
    find: findReducer,
    create: createReducer,
    delete: deleteReducer
})

export default reducer