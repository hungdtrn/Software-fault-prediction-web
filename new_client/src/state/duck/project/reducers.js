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
const findReducer = (state=initialFindState, action) => {
    switch (action.type) {
        case PROJECTTYPES.FIND_ALL_START:
            return Object.assign({}, state, {
                loading: true,
            })
        case PROJECTTYPES.FIND_ALL_SUCCESS:
            return Object.assign({}, state, {
                loading: false,
                error: null,
                projects: action.payload.projects
            })
        case PROJECTTYPES.FIND_ALL_ERROR:
            return Object.assign({}, state, {
                loading: false,
                error: action.payload.error,
                projects: []
            })
        case PROJECTTYPES.FIND_BY_ID_START:
            return Object.assign({}, state, {
                loading: true,
            })
        case PROJECTTYPES.FIND_BY_ID_IN_ARRAY: 
            let currentProject = state.projects.find(item => item._id == action.payload.id)
            if (!currentProject) currentProject = null

            return Object.assign({}, state, {
                loading: false,
                currentProject
            })
        case PROJECTTYPES.FIND_BY_ID_SUCCESS:
            return Object.assign({}, state, {
                loading: false,
                currentProject: action.payload.currentProject
            })
        case PROJECTTYPES.FIND_BY_ID_ERROR:
            return Object.assign({}, state, {
                loading: false,
                currentProject: null,
                error: action.payload.error
            })
        case PROJECTTYPES.CLEAR_FIND_ERROR:
            return Object.assign({}, state, {
                error: null
            })
        case PROJECTTYPES.CREATE_SUCCESS:
            return Object.assign({}, state, {
                projects: [...state.projects, action.payload.createdProject]
            })
        default:
            return state
    }
}

const initialCreateState = {
    loading: false,
    createdProject: null,
    error: null
}
const createReducer = (state=initialCreateState, action) => {
    switch (action.type) {
        case PROJECTTYPES.CREATE_START:
            return Object.assign({}, state, {
                loading: true,
                error: null,
            })
        case PROJECTTYPES.CREATE_ERROR:
            return Object.assign({}, state, {
                loading: false,
                createdProject: null,
                error: action.payload.error
            })
        case PROJECTTYPES.CREATE_SUCCESS:
            return Object.assign({}, state, {
                loading: false,
                createdProject: action.payload.createdProject,
                error: null
            })
        case PROJECTTYPES.CLEAR_CREATE_ERROR:
            return Object.assign({}, state, {
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
        case PROJECTTYPES.DELETE_START:
            return Object.assign({}, state, {
                loading: true,
                error: null
            })
        case PROJECTTYPES.DELETE_ERROR:
            return Object.assign({}, state, {
                loading: false,
                success: false,
                error: action.payload.error
            })
        case PROJECTTYPES.DELETE_SUCCESS:
            return Object.assign({}, state, {
                loading: false,
                error: null,
                success: true,
            })
        case PROJECTTYPES.CLEAR_DELETE_ERROR:
            return Object.assign({}, state, {
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