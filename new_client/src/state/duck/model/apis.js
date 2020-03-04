import fetch from '../../utils/fetch'
import { getToken } from '../../utils/token'

async function findAll( ) {
    return await fetch(`/models`, "GET", null, getToken())
}

export {
    findAll
}