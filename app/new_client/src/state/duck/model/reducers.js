/* REDUCER(S)

It's a good practice to define your state shape first.
Based on the state shape, multiple reducers might be defined in this file, combined and exported into a single reducer function.

*/

import * as MODELTYPES from "./types"
import { combineReducers } from "redux"

const initialFindState = {
    loading: false,
    models: [],
    currentModel: null,
    error: null
}
const findReducer = (state=initialFindState, action) => {
    switch (action.type) {
        case MODELTYPES.FIND_ALL_START:
            return Object.assign({}, state, {
                loading: true,
                models: [],
                error: null
            })    
        case MODELTYPES.FIND_ALL_ERROR:
            return Object.assign({}, state, {
                loading: false,
                models: [],
                error: action.payload.error
            })    
        case MODELTYPES.FIND_ALL_SUCCESS:
            return Object.assign({}, state, {
                loading: false,
                models: action.payload.models,
                error: null
            })    
        case MODELTYPES.CLEAR_FIND_ERROR:
            return Object.assign({}, state, {
                loading: false,
                models: [],
                error: null
            })
        case MODELTYPES.FIND_BY_ID_START:
            return Object.assign({}, state, {
                loading: true,
                error: null,
                currentModel: null
            })    
        case MODELTYPES.FIND_BY_ID_ERROR:
            return Object.assign({}, state, {
                loading: false,
                error: action.payload.error,
                currentModel: null
            })    
        case MODELTYPES.FIND_BY_ID_SUCCESS:
            return Object.assign({}, state, {
                loading: false,
                currentModel: action.payload.currentModel,
                error: null
            })    
        case MODELTYPES.CLEAR_FIND_BY_ID:
            return Object.assign({}, state, {
                loading: false,
                currentModel: null,
                error: null
            })
        case MODELTYPES.CREATE_SUCCESS:
            return Object.assign({}, state, {
                models: [...state.models, action.payload.createdModel]
            })
        case MODELTYPES.DELETE_SUCCESS:
            return Object.assign({}, state, {
                models: state.models.filter(item => item._id != action.payload.deletedId)
            })
        default:
            return state;
    }
}

const initialCreateState = {
    loading: false,
    createdModel: null,
    error: null
}
const createReducer = (state=initialCreateState, action) => {
    switch (action.type) {
        case MODELTYPES.CREATE_START:
            return Object.assign({}, state, {
                loading: true,
                createdModel: null,
                error: null
            })    
        case MODELTYPES.CREATE_ERROR:
            return Object.assign({}, state, {
                loading: false,
                createdModel: null,
                error: action.payload.error
            })
        case MODELTYPES.CREATE_SUCCESS:
            return Object.assign({}, state, {
                loading: false,
                createdModel: action.payload.createdModel,
                error: null
            })
        case MODELTYPES.CLEAR_CREATE:
            return Object.assign({}, state, {
                loading: false,
                createdModel: null,
                error: null
            })
        default:
            return state;
    }
}

const initialDeleteCreate = {
    loading: false,
    success: false,
    error: null
}

const deleteReducer = (state=initialDeleteCreate, action) => {
    switch (action.type) {
        case MODELTYPES.DELETE_START:
            return Object.assign({}, state, {
                loading: true,
                success: false,
                error: null
            })
        case MODELTYPES.DELETE_ERROR:
            return Object.assign({}, state, {
                loading: false,
                success: false,
                error: action.payload.error
            })
        case MODELTYPES.DELETE_SUCCESS:
            return Object.assign({}, state, {
                loading: false,
                success: true,
                error: null
            })
        case MODELTYPES.CLEAR_DELETE:
            return Object.assign({}, state, {
                loading: false,
                success: false,
                error: null,
            })
        default:
            return state;
    }
}

const reducer = combineReducers({
    find: findReducer,
    create: createReducer,
    delete: deleteReducer,
})

export default reducer
