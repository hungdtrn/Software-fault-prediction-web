import fetch from '../../utils/fetch'
import { getToken } from '../../utils/token'

async function findAll( ) {
    return await fetch(`/models`, "GET", null, getToken())
}

async function findById ( id ) {
    return await fetch(`/models/${id}`, "GET", null, getToken())
}

async function create ( model ) {
    let formData = new FormData()
    formData.append("name", model.name)
    if (model.description) formData.append("description", model.description)
    formData.append("file", model.file)

    return await fetch(`/models`, "POST", formData, getToken(), true)
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