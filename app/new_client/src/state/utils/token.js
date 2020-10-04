const setToken = (accessToken, remember) => {
    if (remember) {
        localStorage.setItem("accessToken", accessToken)
    } else {
        sessionStorage.setItem("accessToken", accessToken)
    }
}

const getToken = () => {
    let token = localStorage.getItem("accessToken")

    if (!token) token = sessionStorage.getItem("accessToken")

    return token
}

const clearToken = () => {
    localStorage.removeItem("accessToken")
    sessionStorage.removeItem("accessToken")
}

const parseToken = (token) => {
    const mainContent = token.split(".")[1]
    const user = JSON.parse(atob(mainContent))

    return user
}

export {
    setToken,
    getToken,
    parseToken,
    clearToken,
}