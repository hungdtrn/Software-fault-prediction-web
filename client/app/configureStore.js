import { createStore, applyMiddleware, compose } from 'redux';
import { routerMiddleware } from 'connected-react-router';
import createSagaMiddleware from 'redux-saga';
import createReducer from './reducers';
import { listSagas } from './reducers';

export default function configureStore(initialState = {}, history) {
    const sagaMiddleware = createSagaMiddleware();
    // Create the store with two middlewares
    // 1. sagaMiddleware: Makes redux-sagas work
    // 2. routerMiddleware: Syncs the location/URL path to the state
    const middlewares = [sagaMiddleware, routerMiddleware(history)];
    
    const enhancers = [applyMiddleware(...middlewares)];

    const store = createStore(
        createReducer(),
        initialState,
        composeEnhancers(...enhancers),
    );
    
    // Extensions
    for (let i = 0; i < listSagas.length; i++) {
        sagaMiddleware.run(listSagas[i])
    }

    return store;
}