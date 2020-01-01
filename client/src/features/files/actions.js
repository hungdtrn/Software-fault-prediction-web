export const ACTIONTYPES = {
    "REQUEST_FIND_BY_ID": "FILE_REQUEST_FIND_BY_ID",
    "REQUEST_PREDICT_BY_ID": "FILE_REQUEST_PREDICT_BY_ID",
    "FIND_BY_ID_BEGIN": "FILE_FIND_BY_ID_BEGIN",
    "FIND_BY_ID_SUCCESS": "FILE_FIND_BY_ID_SUCCESS",
    "FIND_BY_ID_ERROR": "FILE_FIND_BY_ID_ERROR",
};

export const requestFindById = (id, projectId) => {
    return {
        type: ACTIONTYPES.REQUEST_FIND_BY_ID,
        payload: {
            id,
            projectId
        }
    }
}

export const requestPredictById = (id, modelId) => {
    return {
        type: ACTIONTYPES.REQUEST_PREDICT_BY_ID,
        payload: {
            id,
            modelId
        }
    }
}

export const beginFindById = () => {
    return {
        type: ACTIONTYPES.FIND_BY_ID_BEGIN,
    }
}