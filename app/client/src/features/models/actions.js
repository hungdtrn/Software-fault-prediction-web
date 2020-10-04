export const ACTIONTYPES = {
    "REQUEST_FIND_BY_ID": "MODEL_REQUEST_FIND_BY_ID",
    "FIND_BY_ID_SUCCESS": "MODEL_FIND_BY_ID_SUCCESS",
    "FIND_BY_ID_ERROR": "MODEL_FIND_BY_ID_ERROR",

    "REQUEST_FIND_ALL": "MODEL_REQUEST_FIND_ALL",
    "FIND_ALL_SUCCESS": "MODEL_FIND_ALL_SUCCESS",
    "FIND_ALL_ERROR": "MODEL_FIND_ALL_ERROR",

    "REQUEST_CREATE": "MODEL_REQUEST_CREATE",
    "CREATE_SUCCESS": "MODEL_CREATE_SUCCESS",
    "CREATE_ERROR": "MODEL_CREATE_ERROR"
};

export const requestFindById = (id) => {
    return {
        type: ACTIONTYPES.REQUEST_FIND_BY_ID,
        payload: {
            id
        }
    }
}

export const requestFindAll = () => {
    return {
        type: ACTIONTYPES.REQUEST_FIND_ALL
    }
}

export const requestCreate = (model) => {
    return {
        type: ACTIONTYPES.REQUEST_CREATE,
        payload: {
            model
        }
    }
}

export default {
    ACTIONTYPES,
    requestFindAll,
    requestFindById,
    requestCreate
}