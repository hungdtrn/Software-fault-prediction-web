import CONFIG from '../../app/config'

import { getAccessToken } from '../utils'
const PROJECT_API = CONFIG.SERVER_URL + "/api/projects"

async function findAll() {
    const token = getAccessToken()
    const response = await fetch(PROJECT_API, {
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
    const response = await fetch(`${PROJECT_API}/${id}`, {
        method: 'GET',
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
            'Authorization': 'Bearer ' + token 
        }
    })

    return await response.json()
}

async function create(project) {
    const token = getAccessToken()
    const response = await fetch(PROJECT_API, {
        method: 'POST',
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
            'Authorization': 'Bearer ' + token 
        },
        body: JSON.stringify({
            ...project
        })
    })

    return await response.json()
}

export default {
    findAll,
    findById,
    create
}