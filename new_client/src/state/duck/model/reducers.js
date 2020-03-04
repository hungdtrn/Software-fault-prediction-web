/* REDUCER(S)

It's a good practice to define your state shape first.
Based on the state shape, multiple reducers might be defined in this file, combined and exported into a single reducer function.

*/

import * as MODELTYPES from "./types"
import { combineReducers } from "redux"

const initialFindState = {
    loading: false,
    models: [],
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
        default:
            return state;
    }
}

const reducer = combineReducers({
    find: findReducer,
})

export default reducer
