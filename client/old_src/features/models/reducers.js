import { ACTIONTYPES } from './actions'

const initialState = {
    models: [],
    loading: false,
    modelId: null,
    selectedModel: null,
    error: null,
}

const reducer = (state=initialState, action) => {
    switch (action.type) {
        case ACTIONTYPES.FIND_ALL_SUCCESS:
            return Object.assign({}, state, {
                models: action.payload.models,
                loading: false,
                error: null
            })
        case ACTIONTYPES.FIND_ALL_ERROR:
            return Object.assign({}, state, {
                loading: false,
                models: null,
                error: action.payload.error
            })
        case ACTIONTYPES.FIND_BY_ID_SUCCESS:
            return Object.assign({}, state, {
                loading: false,
                selectedModel: action.payload.selectedModel,
                error: null,
            })
        case ACTIONTYPES.FIND_BY_ID_ERROR:
            return Object.assign({}, state, {
                loading: false,
                error: null,
                selectedModel: null
            })
        case ACTIONTYPES.CREATE_SUCCESS:
            return Object.assign({}, state, {
                loading: false,
                modelId: action.payload.modelId,
                error: null
            })
        case ACTIONTYPES.CREATE_ERROR:
            return Object.assign({}, state, {
                loading: false,
                modelId: null,
                error: action.payload.error
            })
        default:
            return state
    }
}

export default reducer;