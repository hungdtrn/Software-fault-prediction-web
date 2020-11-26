import fetch from '../../utils/fetch'
import { getToken } from '../../utils/token'

async function findAll() {
    return await fetch("/users", "GET", null, getToken())
}

async function findById( id ) {
    return await fetch("/users/" + id, "GET", null, getToken())
}


export {
    findAll,
    findById,
}