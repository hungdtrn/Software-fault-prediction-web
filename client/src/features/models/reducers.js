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
            return {
                models: action.payload.models,
                loading: false,
                error: null
            }
        case ACTIONTYPES.FIND_ALL_ERROR:
            return {
                loading: false,
                models: null,
                error: action.payload.error
            }
        case ACTIONTYPES.FIND_BY_ID_SUCCESS:
            return {
                loading: false,
                selectedModel: action.payload.selectedModel,
                error: null,
            }
        case ACTIONTYPES.FIND_BY_ID_ERROR:
            return {
                ...state,
                loading: false,
                error: null,
                selectedModel: null
            }
        case ACTIONTYPES.CREATE_SUCCESS:
            return {
                loading: false,
                modelId: action.payload.modelId,
                error: null
            }
        case ACTIONTYPES.CREATE_ERROR:
            return {
                loading: false,
                modelId: null,
                error: action.payload.error
            }
        default:
            return state
    }
}

export default reducer;