/* REDUCER(S)

It's a good practice to define your state shape first.
Based on the state shape, multiple reducers might be defined in this file, combined and exported into a single reducer function.

*/

import * as PROJECTTYPES from './types'
import { combineReducers } from "redux";


const initialFindState = {
    loading: false,
    projects: [],
    currentProject: null,
    error: null
}
const findReducer = (state, action) => {
    switch (action.type) {
        case PROJECTTYPES.FIND_ALL_START:
            return Object.assign(initialFindState, state, {
                loading: true,
            })
        case PROJECTTYPES.FIND_ALL_SUCCESS:
            return Object.assign(initialFindState, state, {
                loading: false,
                error: null,
                projects: action.payload.projects
            })
        case PROJECTTYPES.FIND_ALL_ERROR:
            return Object.assign(initialFindState, state, {
                loading: false,
                error: action.payload.error,
                projects: []
            })
        case PROJECTTYPES.FIND_BY_ID_START:
            return Object.assign(initialFindState, state, {
                loading: true,
            })
        case PROJECTTYPES.FIND_BY_ID_SUCCESS:
            return Object.assign(initialFindState, state, {
                loading: false,
                currentProject: action.payload.currentProject
            })
        case PROJECTTYPES.FIND_BY_ID_ERROR:
            return Object.assign(initialFindState, state, {
                loading: false,
                currentProject: null,
                error: action.payload.error
            })
        case PROJECTTYPES.CLEAR_FIND_ERROR:
            return Object.assign(initialFindState, state, {
                error: null
            })
        default:
            return initialFindState
    }
}

const initialCreateState = {
    loading: false,
    success: false,
    error: null
}
const createReducer = (state, action) => {
    switch (action.type) {
        case PROJECTTYPES.CREATE_START:
            return Object.assign(initialCreateState, state, {
                loading: true,
                error: null,
            })
        case PROJECTTYPES.CREATE_ERROR:
            return Object.assign(initialCreateState, state, {
                loading: false,
                success: false,
                error: action.payload.error
            })
        case PROJECTTYPES.CREATE_SUCCESS:
            return Object.assign(initialCreateState, state, {
                loading: false,
                success: true,
                error: null
            })
        case PROJECTTYPES.CLEAR_CREATE_ERROR:
            return Object.assign(initialDeleteState, state, {
                error: null
            })
        default:
            return initialCreateState
    }
}

const initialDeleteState = {
    loading: false,
    success: false,
    error: null
}
const deleteReducer = (state, action) => {
    switch (action.type) {
        case PROJECTTYPES.DELETE_START:
            return Object.assign(initialDeleteState, state, {
                loading: true,
                error: null
            })
        case PROJECTTYPES.DELETE_ERROR:
            return Object.assign(initialDeleteState, state, {
                loading: false,
                success: false,
                error: action.payload.error
            })
        case PROJECTTYPES.DELETE_SUCCESS:
            return Object.assign(initialDeleteState, state, {
                loading: false,
                error: null,
                success: true,
            })
        case PROJECTTYPES.CLEAR_DELETE_ERROR:
            return Object.assign(initialDeleteState, state, {
                error: null
            })
        default:
            return initialDeleteState;
    }
}

const reducer = combineReducers({
    find: findReducer,
    create: createReducer,
    delete: deleteReducer
})

export default reducer