import { createStore, applyMiddleware } from 'redux';
import createSagaMiddleware from 'redux-saga'

import rootReducer from './rootReducer'
import logger from 'redux-logger'

import Auth from '../features/auth'
import Project from '../features/projects'
import File from '../features/files'
import Model from '../features/models'

const sagaMiddleware = createSagaMiddleware()

const configureStore = (initialState = {}, history) => {
    const store = createStore(
        rootReducer,
        applyMiddleware(logger, sagaMiddleware)
    
    )
    sagaMiddleware.run(Auth.sagas)
    sagaMiddleware.run(Project.sagas)
    sagaMiddleware.run(File.sagas)
    sagaMiddleware.run(Model.sagas)

    return store
}

export default configureStore