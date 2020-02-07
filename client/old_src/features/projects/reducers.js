import { ACTIONTYPES } from './actions'

const initialState = {
    projects: [],
    loading: false,
    projectId: null,
    selectedProject: null,
    error: null,
}

const reducer = (state=initialState, action) => {
    switch (action.type) {
        case ACTIONTYPES.FIND_ALL_SUCCESS:
            return Object.assign({}, state, {
                projects: action.payload.projects,
                loading: false,
                error: null
            })
        case ACTIONTYPES.FIND_ALL_ERROR:
            return Object.assign({}, state, {
                loading: false,
                projects: null,
                error: action.payload.error
            })
        case ACTIONTYPES.FIND_BY_ID_SUCCESS:
            return Object.assign({}, state, {
                loading: false,
                selectedProject: action.payload.selectedProject,
                error: null,
            })
        case ACTIONTYPES.FIND_BY_ID_ERROR:
            return Object.assign({}, state, {
                loading: false,
                error: null,
                selectedProject: null
            })
        case ACTIONTYPES.CREATE_SUCCESS:
            return Object.assign({}, state, {
                loading: false,
                projectId: action.payload.projectId,
                error: null
            })
        case ACTIONTYPES.CREATE_ERROR:
            return Object.assign({}, state, {
                loading: false,
                projectId: null,
                error: action.payload.error
            })
        default:
            return state
    }
}

export default reducer;