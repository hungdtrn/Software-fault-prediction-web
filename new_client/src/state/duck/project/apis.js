import fetch from '../../utils/fetch'
import { getToken } from '../../utils/token'

async function findAll() {
    return await fetch("/projects", "GET", null, getToken())
}

async function findById( id ) {
    return await fetch("/projects/" + id, "GET", null, getToken())
}

async function create( project ) {
    return await fetch("/projects", "POST", {
        ...project
    }, getToken())
}

async function deleteById( id ) {
    return await fetch("/projects" + id, "DELETE", null, getToken())
}

export {
    findAll,
    findById,
    create,
    deleteById
}