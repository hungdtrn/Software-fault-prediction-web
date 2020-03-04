/* REDUCER(S)

It's a good practice to define your state shape first.
Based on the state shape, multiple reducers might be defined in this file, combined and exported into a single reducer function.

*/

import * as FILETYPES from "./types"
import { combineReducers } from "redux"

const initialFindState = {
    loading: false,
    currentFile: null,
    error: null
}
const findReducer = (state=initialFindState, action) => {
    switch (action.type) {
        case FILETYPES.FIND_BY_ID_START:
            return Object.assign({}, state, {
                loading: true,
                currentFile: null,
                error: null
            })    
        case FILETYPES.FIND_BY_ID_ERROR:
            return Object.assign({}, state, {
                loading: false,
                currentFile: null,
                error: action.payload.error
            })    
        case FILETYPES.FIND_BY_ID_SUCCESS:
            return Object.assign({}, state, {
                loading: false,
                currentFile: action.payload.currentFile,
                error: null
            })    
        case FILETYPES.CLEAR_FIND_ERROR:
            return Object.assign({}, state, {
                loading: false,
                currentFile: null,
                error: null
            })    
        default:
            return state;
    }
}

const initialPredictState = {
    loading: false,
    updatedFile: null,
    error: null,
}

const predictReducer = (state=initialPredictState, action) => {
    switch (action.type) {
        case FILETYPES.PREDICT_BY_ID_START:
            return Object.assign({}, state, {
                loading: true,
                updatedFile: null,
                error: null
            })
        case FILETYPES.PREDICT_BY_ID_ERROR:
            return Object.assign({}, state, {
                loading: false,
                updatedFile: null,
                error: action.payload.error
            })
        case FILETYPES.PREDICT_BY_ID_SUCCESS:
            return Object.assign({}, state, {
                loading: false,
                updatedFile: action.payload.updatedFile,
                error: null
            })
        case FILETYPES.CLEAR_PREDICT_ERROR:
            return Object.assign({}, state, {
                loading: false,
                updatedFile: null,
                error: null
            })
        default:
            return state;
    }
}

const reducer = combineReducers({
    find: findReducer,
    predict: predictReducer
})

export default reducer
