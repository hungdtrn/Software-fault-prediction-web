import { put, call, delay, race, select } from 'redux-saga/effects'

import * as projectType from './types.js'
import * as projectAction from './actions'
import * as projectOperation from './operations'
import * as projectApi from './apis'
import { findReducer, createReducer, deleteReducer } from './reducers'
import { CONFIG } from '../../globals'

describe("Project actions", () => {
    it("Should create action to find all projects", () => {
        const expectedAction = {
            type: projectType.FIND_ALL_REQUEST
        }

        expect(projectAction.findAllRequest()).toEqual(expectedAction)
    })

    it("Should create action to start find all process", () => {
        const expectedAction = {
            type: projectType.FIND_ALL_START
        }

        expect(projectAction.findAllStart()).toEqual(expectedAction)
    })

    it("Should create action for find all success", () => {
        const projects = [{
            "id": 1,
            "name": "test"
        }, {
            "id": 2,
            "name": "test2"
        }]
        expect(projectAction.findAllSuccess(projects)).toEqual({
            type: projectType.FIND_ALL_SUCCESS,
            payload: {
                projects
            }
        })
    })

    it("Should create action for find all error", () => {
        const errorMsg = "Error"
        expect(projectAction.findAllError(errorMsg)).toEqual({
            type: projectType.FIND_ALL_ERROR,
            payload: {
                error: errorMsg
            }
        })
    })

    it("Should create action to find by id", () => {
        const id = "id"
        expect(projectAction.findByIdRequest(id)).toEqual({
            type: projectType.FIND_BY_ID_REQUEST,
            payload: {
                id
            }
        })
    })

    it("Should create action to start find by id process", () => {
        expect(projectAction.findByIdStart()).toEqual({
            type: projectType.FIND_BY_ID_START
        })
    })

    it("Should create action for find by id success", () => {
        const project = {
            id: "id",
            name: "test"
        }

        expect(projectAction.findByIdSuccess(project)).toEqual({
            type: projectType.FIND_BY_ID_SUCCESS,
            payload: {
                currentProject: project
            }
        })
    })

    it("Should create action for find by id error", () => {
        const error = "error"

        expect(projectAction.findByIdError(error)).toEqual({
            type: projectType.FIND_BY_ID_ERROR,
            payload: {
                error
            }
        })
    })

    it("Should create action to create", () => {
        const project = {
            "name": "test"
        }

        expect(projectAction.createRequest(project)).toEqual({
            type: projectType.CREATE_REQUEST,
            payload: {
                project
            }
        })
    })

    it("Should create action to start create process", () => {
        expect(projectAction.createStart()).toEqual({
            type: projectType.CREATE_START
        })
    })

    it("Should create action for create success", () => {
        const project = {
            "id": "test",
            "name": "test"
        }

        expect(projectAction.createSuccess(project)).toEqual({
            type: projectType.CREATE_SUCCESS,
            payload: {
                createdProject: project
            }
        })
    })

    it("Should create action for create error", () => {
        const error = "Error"

        expect(projectAction.createError(error)).toEqual({
            type: projectType.CREATE_ERROR,
            payload: {
                error
            }
        })
    })

    it("Should create action to delete", () => {
        const id = "project id"
        
        expect(projectAction.deleteRequest(id)).toEqual({
            type: projectType.DELETE_REQUEST,
            payload: {
                id
            }
        })
    })

    it("Should create action to start delete process", () => {
        expect(projectAction.deleteStart()).toEqual({
            type: projectType.DELETE_START,
        })
    })

    it("Should create action for delete success", () => {
        expect(projectAction.deleteSuccess()).toEqual({
            type: projectType.DELETE_SUCCESS
        })
    })

    it("Should create action for delete error", () => {
        const error = "error"

        expect(projectAction.deleteError(error)).toEqual({
            type: projectType.DELETE_ERROR,
            payload: {
                error
            }
        })
    })

    it("Should create action to clear find error", () => {
        expect(projectAction.clearFindError()).toEqual({
            type: projectType.CLEAR_FIND_ERROR,
        })
    })

    it("Should create action to clear create error", () => {
        expect(projectAction.clearCreateError()).toEqual({
            type: projectType.CLEAR_CREATE_ERROR,
        })
    })

    it("Should create action to clear delete error", () => {
        expect(projectAction.clearDeleteError()).toEqual({
            type: projectType.CLEAR_DELETE_ERROR
        })
    })

})

describe("Project operations (sagas)", () => {
    it("Should start find all", () => {
        const generator = projectOperation.findAll()
        
        expect(generator.next().value).toEqual(put(projectAction.findAllStart()))
    })

    it("Should find all fail (connection)", () => {
        const generator = projectOperation.findAll()

        // Call request start
        generator.next()

        // Find project
        expect(generator.next().value).toEqual(race({
            response: call(projectApi.findAll),
            timeout: delay(CONFIG.REQUEST_TIMEOUT)
        }))

        // Should call error on timeout
        let next = generator.next({
            timeout: true
        })

        expect(next.value).toEqual(put(projectAction.findAllError("Timeout")))

    })

    it("Should find all fail (server)", () => {
        const generator = projectOperation.findAll()
        const serveError = "Error"        

        // Call request start
        generator.next()

        // Find project
        expect(generator.next().value).toEqual(race({
            response: call(projectApi.findAll),
            timeout: delay(CONFIG.REQUEST_TIMEOUT)
        }))

        // Should call error on timeout
        let next = generator.next({
            response: {
                result: "",
                msg: serveError
            }
        })

        expect(next.value).toEqual(put(projectAction.findAllError(serveError)))
    })

    it("Should find all success", () => {
        const generator = projectOperation.findAll()
        const serverResult = {
            "id": 1,
            "name": "project",
        }        

        // Call request start
        generator.next()

        // Find project
        expect(generator.next().value).toEqual(race({
            response: call(projectApi.findAll),
            timeout: delay(CONFIG.REQUEST_TIMEOUT)
        }))

        // Should call error on timeout
        let next = generator.next({
            response: {
                result: serverResult,
                msg: null
            }
        })

        expect(next.value).toEqual(put(projectAction.findAllSuccess(serverResult)))
    })

    it("Should start find by id", () => {
        const id = "id"
        const action = projectAction.findByIdRequest(id)
        const generator = projectOperation.findById(action)
        
        expect(generator.next().value).toEqual(put(projectAction.findByIdStart()))
    })

    it("Should find by id fail (connection)", () => {
        const id = "id"
        const action = projectAction.findByIdRequest(id)
        const generator = projectOperation.findById(action)

        generator.next()

        // Find project by id
        expect(generator.next().value).toEqual(race({
            response: call(projectApi.findById, action.payload.id),
            timeout: delay(CONFIG.REQUEST_TIMEOUT)
        }))

        let next = generator.next({
            timeout: true
        })

        expect(next.value).toEqual(put(projectAction.findByIdError("Timeout")))
    })

    it("Should find by id fail (server)", () => {
        const id = "id"
        const action = projectAction.findByIdRequest(id)
        const generator = projectOperation.findById(action)
        const error = "error"

        generator.next()

        // Find project by id
        expect(generator.next().value).toEqual(race({
            response: call(projectApi.findById, action.payload.id),
            timeout: delay(CONFIG.REQUEST_TIMEOUT)
        }))

        let next = generator.next({
            response: {
                result: null,
                msg: error
            }
        })

        expect(next.value).toEqual(put(projectAction.findByIdError(error)))
    })

    it("Should find by id success", () => {
        const id = "id"
        const action = projectAction.findByIdRequest(id)
        const generator = projectOperation.findById(action)
        const result = {
            id: "id",
            name: "name"
        }

        generator.next()

        // Find project by id
        expect(generator.next().value).toEqual(race({
            response: call(projectApi.findById, action.payload.id),
            timeout: delay(CONFIG.REQUEST_TIMEOUT)
        }))

        let next = generator.next({
            response: {
                result,
                msg: null
            }
        })

        expect(next.value).toEqual(put(projectAction.findByIdSuccess(result)))
    })

    it("Should start create", () => {
        const projectForm = {
            name: "test"
        }
        const createAction = projectAction.createRequest(projectForm)
        const generator = projectOperation.create(createAction)
        
        expect(generator.next().value).toEqual(put(projectAction.createStart()))
    })

    it("Should create fail (connection)", () => {
        const projectForm = {
            name: "test"
        }
        const createAction = projectAction.createRequest(projectForm)
        const generator = projectOperation.create(createAction)

        generator.next()

        expect(generator.next().value).toEqual(race({
            response: call(projectApi.create, createAction.payload.project),
            timeout: delay(CONFIG.REQUEST_TIMEOUT)
        }))

        let next = generator.next({
            timeout: true
        })

        expect(next.value).toEqual(put(projectAction.createError("Timeout")))

    })

    it("Should create fail (server)", () => {
        const projectForm = {
            name: "test"
        }
        const error = "Error"
        const createAction = projectAction.createRequest(projectForm)
        const generator = projectOperation.create(createAction)

        generator.next()

        expect(generator.next().value).toEqual(race({
            response: call(projectApi.create, createAction.payload.project),
            timeout: delay(CONFIG.REQUEST_TIMEOUT)
        }))

        let next = generator.next({
            response: {
                result: null,
                msg: error
            }
        })

        expect(next.value).toEqual(put(projectAction.createError(error)))
    })

    it("Should create success", () => {
        const projectForm = {
            name: "test"
        }

        const createAction = projectAction.createRequest(projectForm)
        const generator = projectOperation.create(createAction)

        generator.next()

        expect(generator.next().value).toEqual(race({
            response: call(projectApi.create, createAction.payload.project),
            timeout: delay(CONFIG.REQUEST_TIMEOUT)
        }))

        let next = generator.next({
            response: {
                result: projectForm,
                msg: null
            }
        })

        expect(next.value).toEqual(put(projectAction.createSuccess(projectForm)))
    })

    it("Should delete start", () => {
        const id = "id"
        const action = projectAction.deleteRequest(id)
        const generator = projectOperation.deleteById(action)

        expect(generator.next().value).toEqual(put(projectAction.deleteStart()))
    })

    it("Should delete fail (connection)", () => {
        const id = "id"
        const action = projectAction.deleteRequest(id)
        const generator = projectOperation.deleteById(action)

        generator.next()

        expect(generator.next().value).toEqual(race({
            response: call(projectApi.deleteById, action.payload.id),
            timeout: delay(CONFIG.REQUEST_TIMEOUT)
        }))

        let next = generator.next({
            timeout: true
        })

        expect(next.value).toEqual(put(projectAction.deleteError("Timeout")))
    })

    it("Should delete fail (server)", () => {
        const id = "id"
        const action = projectAction.deleteRequest(id)
        const generator = projectOperation.deleteById(action)
        const error = "error"

        generator.next()

        expect(generator.next().value).toEqual(race({
            response: call(projectApi.deleteById, action.payload.id),
            timeout: delay(CONFIG.REQUEST_TIMEOUT)
        }))

        let next = generator.next({
            response: {
                result: null,
                msg: error
            }
        })

        expect(next.value).toEqual(put(projectAction.deleteError(error)))
    })

    it("Should delete success", () => {
        const id = "id"
        const action = projectAction.deleteRequest(id)
        const generator = projectOperation.deleteById(action)

    
        generator.next()

        expect(generator.next().value).toEqual(race({
            response: call(projectApi.deleteById, action.payload.id),
            timeout: delay(CONFIG.REQUEST_TIMEOUT)
        }))

        let next = generator.next({
            response: {
                result: true,
                msg: null
            }
        })

        expect(next.value).toEqual(put(projectAction.deleteSuccess()))
    })

})

describe("Project reducer", () => {
    it("Should return default find state", () => {
        expect(findReducer(undefined, {})).toEqual({
            loading: false,
            projects: [],
            currentProject: null,
            error: null
        })
    })

    it("Should handle find all start", () => {
        expect(findReducer({
            loading: false,
            projects: [],
            currentProject: null,
            error: null        
        }, projectAction.findAllStart())).toEqual({
            loading: true,
            projects: [],
            currentProject: null,
            error: null
        })
    })

    it("Should handle find all error", () => {
        const error = "Error"
        expect(findReducer({
            loading: true,
            projects: [],
            currentProject: null,
            error: null        
        }, projectAction.findAllError(error))).toEqual({
            loading: false,
            projects: [],
            currentProject: null,
            error
        })
    })

    it("Should handle find all success", () => {
        const projects = [
            {
                id: "1",
                name: "name "
            }
        ]
        
        expect(findReducer({
            loading: true,
            projects: [],
            currentProject: null,
            error: null        
        }, projectAction.findAllSuccess(projects))).toEqual({
            loading: false,
            projects: projects,
            currentProject: null,
            error: null
        })
    })

    it("Should handle find by id start", () => {
        const projects = [
            {
                id: "1",
                name: "name "
            }
        ]

        expect(findReducer({
            loading: false,
            projects: projects,
            currentProject: null,
            error: null        
        }, projectAction.findByIdStart())).toEqual({
            loading: true,
            projects: projects,
            currentProject: null,
            error: null
        })
    })

    it("Should handle find by id error", () => {
        const projects = [
            {
                id: "1",
                name: "name "
            }
        ]

        const error = "error"
        
        expect(findReducer({
            loading: true,
            projects: projects,
            currentProject: null,
            error: null        
        }, projectAction.findByIdError(error))).toEqual({
            loading: false,
            projects: projects,
            currentProject: null,
            error: error
        })

    })

    it("Should handle find by id success", () => {
        const projects = [
            {
                id: "1",
                name: "name "
            }
        ]
        
        expect(findReducer({
            loading: false,
            projects: projects,
            currentProject: null,
            error: null        
        }, projectAction.findByIdSuccess(projects[0]))).toEqual({
            loading: false,
            projects: projects,
            currentProject: projects[0],
            error: null
        })
    })

    it("Should handle clear find error", () => {
        const projects = [
            {
                id: "1",
                name: "name "
            }
        ]
        
        expect(findReducer({
            loading: false,
            projects: projects,
            currentProject: null,
            error: "Error"        
        }, projectAction.clearFindError())).toEqual({
            loading: false,
            projects: projects,
            currentProject: null,
            error: null
        })
    })

    it("Should return default create state", () => {
        expect(createReducer(undefined, {})).toEqual({
            loading: false,
            success: false,
            error: null
        })
    })

    it("Should handle create start", () => {
        expect(createReducer({
            loading: false,
            success: false,
            error: null
        }, projectAction.createStart())).toEqual({
            loading: true,
            success: false,
            error: null
        })
    })

    it("Should handle create error", () => {
        const error = "error"

        expect(createReducer({
            loading: true,
            success: false,
            error: null
        }, projectAction.createError(error))).toEqual({
            loading: false,
            success: false,
            error: error
        })
    })

    it("Should handle create success", () => {
        expect(createReducer({
            loading: true,
            success: false,
            error: null
        }, projectAction.createSuccess())).toEqual({
            loading: false,
            success: true,
            error: null
        })
    })

    it("Should handle clear create error", () => {
        expect(createReducer({
            loading: false,
            success: false,
            error: "Error"
        }, projectAction.clearCreateError())).toEqual({
            loading: false,
            success: false,
            error: null
        })
    })

    it("Should return default delete state", () => {
        expect(deleteReducer(undefined, {})).toEqual({
            loading: false,
            success: false,
            error: null
        })
    })

    it("Should handle delete start", () => {
        expect(deleteReducer({
            loading: false,
            success: false,
            error: null
        }, projectAction.deleteStart())).toEqual({
            loading: true,
            success: false,
            error: null
        })
    })

    it("Should handle delete error", () => {
        const error = "error"

        expect(deleteReducer({
            loading: true,
            success: false,
            error: null
        }, projectAction.deleteError(error))).toEqual({
            loading: false,
            success: false,
            error: error
        })
    })

    it("Should handle delete success", () => {
        expect(deleteReducer({
            loading: true,
            success: false,
            error: null
        }, projectAction.deleteSuccess())).toEqual({
            loading: false,
            success: true,
            error: null
        })
    })

    it("Should handle clear delete error", () => {
        expect(deleteReducer({
            loading: false,
            success: false,
            error: "Error"
        }, projectAction.clearDeleteError())).toEqual({
            loading: false,
            success: false,
            error: null
        })
    })
})