export const ACTIONTYPES = {
    "REQUEST_FIND_BY_ID": "PROJECT_REQUEST_FIND_BY_ID",
    "FIND_BY_ID_SUCCESS": "PROJECT_FIND_BY_ID_SUCCESS",
    "FIND_BY_ID_ERROR": "PROJECT_FIND_BY_ID_ERROR",

    "REQUEST_FIND_ALL": "PROJECT_REQUEST_FIND_ALL",
    "FIND_ALL_SUCCESS": "PROJECT_FIND_ALL_SUCCESS",
    "FIND_ALL_ERROR": "PROJECT_FIND_ALL_ERROR",

    "REQUEST_CREATE": "PROJECT_REQUEST_CREATE",
    "CREATE_SUCCESS": "PROJECT_CREATE_SUCCESS",
    "CREATE_ERROR": "PROJECT_CREATE_ERROR"
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

export const requestCreate = (project) => {
    return {
        type: ACTIONTYPES.REQUEST_CREATE,
        payload: {
            project
        }
    }
}


