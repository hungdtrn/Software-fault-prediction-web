import { ACTIONTYPES } from './actions'

const initialState = {
    loading: false,
    selectedFile: null,
    updatedFile: null,
    error: null
}

const reducer = (state=initialState, action) => {
    switch (action.type) {
        case ACTIONTYPES.FIND_BY_ID_BEGIN:
            return Object.assign({}, state, {
                loading: true,
                selectedFile: null,
                updatedFile: null,
                error: null            
            })
        case ACTIONTYPES.FIND_BY_ID_SUCCESS:
            return Object.assign({}, state, {
                selectedFile: action.payload.selectedFile,
                error: null,
                loading: false,
                updatedFile: null,
            })
        case ACTIONTYPES.FIND_ALL_ERROR:
            return Object.assign({}, state, {
                loading: false,
                selectedFile: null,
                error: action.payload.error,
                updatedFile: null,
            })
        case ACTIONTYPES.PREDICT_SUCCESS:
            return Object.assign({}, state, {
                loading: false,
                error: null,
                updatedFile: action.payload.updatedFile
            })
        case ACTIONTYPES.PREDICT_ERROR:
            return Object.assign({}, state, {
                loading: false,
                error: action.payload.error,
                updatedFile: null,
            })
        default:
            return state;
    }
}

export default reducer