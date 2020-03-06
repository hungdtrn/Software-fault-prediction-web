import fetch from '../../utils/fetch'
import { getToken } from '../../utils/token'

async function findAll( ) {
    return await fetch(`/models`, "GET", null, getToken())
}

async function findById ( id ) {
    return await fetch(`/models/${id}`, "GET", null, getToken())
}

async function create ( model ) {
    return await fetch(`/models`, "POST", {
        ...model
    }, getToken())
}

async function deleteById ( id ) {
    return await fetch(`/models/${id}`, "DELETE", null, getToken())
}

export {
    findAll,
    findById,
    create,
    deleteById
}