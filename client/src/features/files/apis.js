import CONFIG from '../../app/config'

import { getAccessToken } from '../utils'
const FILE_API = CONFIG.SERVER_URL + "/api/files"

async function findById(fileId, projectId) {
    const token = getAccessToken()
    const response = await fetch(`${FILE_API}/${fileId}?projectId=${encodeURIComponent(projectId)}`, {
        method: 'GET',
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
            'Authorization': 'Bearer ' + token 
        }
    })

    return await response.json()
}

export default {
    findById,
}