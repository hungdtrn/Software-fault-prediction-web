export const ACTIONTYPES = {
    "REQUEST_LOGIN": "AUTH_REQUEST_LOGIN",
    "LOGIN_SUCCESS": "AUTH_LOGIN_SUCCESS",
    "LOGIN_ERROR": "AUTH_LOGIN_ERROR",

    "REQUEST_REGISTER": "AUTH_REQUEST_REGISTER",
    "REGISTER_SUCCESS": "AUTH_REGISTER_SUCCESS",
    "REGISTER_ERROR": "AUTH_REGISTER_ERROR",

    "CLEAR_ERROR": "AUTH_CLEAR_ERROR"
}

export const requestLogin = ({ username, password, remember }) => {
    return {
        type: ACTIONTYPES.REQUEST_LOGIN,
        payload: {
            user: {
                username,
                password
            },
            remember
        }
    }
}

export const requestRegister = ({ username, email, password }) => {
    return {
        type: ACTIONTYPES.REQUEST_REGISTER,
        payload: {
            user: {
                username,
                email,
                password
            }
        }
    }
}

export const clearError = () => {
    return {
        type: ACTIONTYPES.CLEAR_ERROR
    }
}