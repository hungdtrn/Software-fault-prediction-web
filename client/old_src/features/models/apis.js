import CONFIG from '../../app/config'

import { getAccessToken } from '../utils'
const MODEL_API = CONFIG.SERVER_URL + "/api/models"

async function findAll() {
    const token = getAccessToken()
    const response = await fetch(MODEL_API, {
        method: 'GET',
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
            'Authorization': 'Bearer ' + token 
        },
    })

    return await response.json()
}

async function findById(id) {
    const token = getAccessToken()
    const response = await fetch(`${MODEL_API}/${id}`, {
        method: 'GET',
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
            'Authorization': 'Bearer ' + token 
        }
    })

    return await response.json()
}

async function create(model) {
    const token = getAccessToken()
    let formData = new FormData()

    formData.append("name", model.name)
    if (model.description) formData.append("description", model.description)
    formData.append("file", model.file)


    const response = await fetch(MODEL_API, {
        method: 'POST',
        headers: {
            'Authorization': 'Bearer ' + token 
        },
        body: formData
    })

    return await response.json()
}

export default {
    findAll,
    findById,
    create
}