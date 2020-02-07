import { createStore, applyMiddleware, combineReducers } from "redux";
import * as reducers from './duck'

export default function configureStore( initialState ) {
    const rootReducer = combineReducers( reducers );

    return createStore(
        rootReducer
    )
}