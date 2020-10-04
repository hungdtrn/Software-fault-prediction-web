import { createStore, applyMiddleware, combineReducers } from "redux";
import createSagaMiddleware from 'redux-saga'

import * as reducers from './duck'
import { runSagas } from './sagas'

const sagaMiddleware = createSagaMiddleware()

export default function configureStore( initialState ) {
    const rootReducer = combineReducers( reducers );

    const store = createStore(
        rootReducer,
        applyMiddleware( sagaMiddleware )
    )

    runSagas(sagaMiddleware);

    return store
}