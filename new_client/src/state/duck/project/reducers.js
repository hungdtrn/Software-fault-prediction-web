/* REDUCER(S)

It's a good practice to define your state shape first.
Based on the state shape, multiple reducers might be defined in this file, combined and exported into a single reducer function.

*/

import * as PROJECTTYPES from './types'


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
    return
}

const initialDeleteState = {
    loading: false,
    success: false,
    error: null
}
const deleteReducer = (state, action) => {
    return
}

export {
    findReducer,
    createReducer,
    deleteReducer
}