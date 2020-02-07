import { combineReducers } from 'redux';

import Auth from '../features/auth'
import Project from '../features/projects'
import File from '../features/files'
import Model from '../features/models'

const rootReducer = combineReducers({
    auth: Auth.reducers,
    project: Project.reducers,
    file: File.reducers,
    model: Model.reducers
})

export default rootReducer