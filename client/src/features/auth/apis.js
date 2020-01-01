import CONFIG from '../../app/config'

const LOGIN_API = CONFIG.SERVER_URL + "/auth/login"
const REGISTER_API = CONFIG.SERVER_URL + "/auth/register"

async function login({ username, password }) {
    const response = await fetch(LOGIN_API, {
        method: 'POST',
        headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            username: username,
            password: password
        })
    })

    console.log(JSON.stringify({
        username: username,
        password: password
    }))

    return await response.json()
}

async function register({ username, email, password }) {
    const response = await fetch(REGISTER_API, {
        method: 'POST',
        headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            username: username,
            email: email,
            password: password
        })
    })

    return await response.json()
}

export default {
    login,
    register
}