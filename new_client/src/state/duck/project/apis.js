import fetch from '../../utils/fetch'

async function findAll() {
    return await fetch("/projects", "GET", {})
}

async function findById( id ) {
    return await fetch("/projects/" + id, "GET")
}

async function create( project ) {
    return await fetch("/projects", "POST", {
        ...project
    })
}

async function deleteById( id ) {
    return await fetch("/projects" + id, "DELETE")
}

export {
    findAll,
    findById,
    create,
    deleteById
}