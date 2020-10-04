import fetch from "../../utils/fetch"

async function login({ username, password }) {
    return await fetch("/auth/login", "POST", {
        username,
        password
    });
}

export {
    login
}