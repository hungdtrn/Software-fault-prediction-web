import { ACTIONTYPES } from './actions'

const initialState = {
    loading: false,
    selectedFile: null,
    error: null
}

const reducer = (state=initialState, action) => {
    switch (action.type) {
        case ACTIONTYPES.FIND_BY_ID_BEGIN:
            return {
                ...state,
                loading: true,
            }
        case ACTIONTYPES.FIND_BY_ID_SUCCESS:
            return {
                ...state,
                selectedFile: action.payload.selectedFile,
                error: null,
                loading: false
            }
        case ACTIONTYPES.FIND_ALL_ERROR:
            return {
                ...state,
                loading: false,
                selectedFile: null,
                error: action.payload.error
            }
        default:
            return initialState;
    }
}

export default reducer