import fetch from '../../utils/fetch'
import { getToken } from '../../utils/token'

async function findById( id, projectId ) {
    return await fetch(`/files/${id}?projectId=${projectId}`, "GET", null, getToken())
}

async function predictById( fileId, modelId ) {
    return await fetch("/files/" + fileId + "/predict", "POST", {
        modelId
    }, getToken())
}

export {
    findById,
    predictById
}