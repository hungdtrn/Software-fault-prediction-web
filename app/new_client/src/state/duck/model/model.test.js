import { put, call, delay, race, select } from 'redux-saga/effects'

import * as modelType from './types.js'
import * as modelAction from './actions'
import * as modelOperation from './operations'
import * as modelApi from './apis'
import modelReducer from './reducers'
import { CONFIG } from '../../globals'

describe("Model actions", () => {
    it("Should create action to perform find all request", () => {
        const expectAction = {
            type: modelType.FIND_ALL_REQUEST,
        }

        expect(modelAction.findAllRequest()).toEqual(expectAction)
    })

    it("Should create action to start find all", () => {
        const expectAction = {
            type: modelType.FIND_ALL_START,
        }

        expect(modelAction.findAllStart()).toEqual(expectAction)

    })

    it("Should create action for find all error", () => {
        const expectAction = {
            type: modelType.FIND_ALL_ERROR,
            payload: {
                error: "error"
            }
        }

        expect(modelAction.findAllError("error")).toEqual(expectAction)
    })

    it("Should create action for find all success", () => {
        const models = [{
            id: "1",
            name: "model1"
        }, {
            id: "2",
            name: "model2"
        }]

        const expectAction = {
            type: modelType.FIND_ALL_SUCCESS,
            payload: {
                models
            }
        }

        expect(modelAction.findAllSuccess(models)).toEqual(expectAction)
    })

    it("Should create action to clear find all error", () => {
        const expectAction = {
            type: modelType.CLEAR_FIND_ERROR,
        }

        expect(modelAction.clearFindError()).toEqual(expectAction)

    })

    it("Should create action to perform find by id request", () => {
        const id = "id"
        const expectAction = {
            type: modelType.FIND_BY_ID_REQUEST,
            payload: {
                id
            }
        }

        expect(modelAction.findByIdRequest(id)).toEqual(expectAction)
    })

    it("Should create action to start find by id", () => {
        expect(modelAction.findByIdStart()).toEqual({
            type: modelType.FIND_BY_ID_START,
        })
    })

    it("Should create action for find by id error", () => {
        const error = "error"
        
        expect(modelAction.findByIdError(error)).toEqual({
            type: modelType.FIND_BY_ID_ERROR,
            payload: {
                error
            }
        })
    })

    it("Should create action for find by id success", () => {
        const currentModel = {
            id: "id",
            name: "name"
        }

        expect(modelAction.findByIdSuccess(currentModel)).toEqual({
            type: modelType.FIND_BY_ID_SUCCESS,
            payload: {
                currentModel
            }
        })
    })

    it("Should create action to clear find by id", () => {
        expect(modelAction.clearFindById()).toEqual({
            type: modelType.CLEAR_FIND_BY_ID,
        })
    })

    it("Should create action to perform create request", () => {
        const modelForm = {
            name: "model"
        }

        expect(modelAction.createRequest(modelForm)).toEqual({
            type: modelType.CREATE_REQUEST,
            payload: {
                model: modelForm
            }
        })
    })

    it("Should create action to start create", () => {
        expect(modelAction.createStart()).toEqual({
            type: modelType.CREATE_START
        })
    })

    it("Should create action for create error", () => {
        const error = "error"
        expect(modelAction.createError(error)).toEqual({
            type: modelType.CREATE_ERROR,
            payload: {
                error
            }
        })
    })

    it("Should create action for create success", () => {
        const createdModel = {
            id: "id",
            name: "name"
        }

        expect(modelAction.createSuccess(createdModel)).toEqual({
            type: modelType.CREATE_SUCCESS,
            payload: {
                createdModel
            }
        })
    })

    it("Should create action to clear create", () => {
        expect(modelAction.clearCreate()).toEqual({
            type: modelType.CLEAR_CREATE
        })
    })

    it("Should create action to perform update request", () => {
        expect(true).toEqual(false)
    })

    it("Should create action for update start", () => {
        expect(true).toEqual(false)
    }) 

    it("Should create action for update error", () => {
        expect(true).toEqual(false)
    })

    it("Should create action for clear update", () => {
        expect(true).toEqual(false)
    })

    it("Should create action to perform delete request", () => {
        const id = "1"
        expect(modelAction.deleteByIdRequest(id)).toEqual({
            type: modelType.DELETE_REQUEST,
            payload: {
                id
            }
        })
    })

    it("Should create action to start delete", () => {
        expect(modelAction.deleteStart()).toEqual({
            type: modelType.DELETE_START
        })
    })

    it("Should create action for delete error", () => {
        const error = "error"
        expect(modelAction.deleteError(error)).toEqual({
            type: modelType.DELETE_ERROR,
            payload: {
                error
            }
        })
    })

    it("Should create action for delete success", () => {
        const deletedId = "id"
        expect(modelAction.deleteSuccess(deletedId)).toEqual({
            type: modelType.DELETE_SUCCESS,
            payload: {
                deletedId
            }
        })
    })

    it("Should create action to clear delete", () => {
        expect(modelAction.clearDelete()).toEqual({
            type: modelType.CLEAR_DELETE
        })
    })
})


describe("Model operations (sagas)", () => {
    it("Should start find all", () => {
        const generator = modelOperation.findAll(modelAction.findAllRequest())
        
        expect(generator.next().value).toEqual(put(modelAction.findAllStart()))
    })

    it("Should find all fail (timeout)", () => {
        const generator = modelOperation.findAll(modelAction.findAllRequest())
        
        generator.next()

        // Find all projects
        expect(generator.next().value).toEqual(race({
            response: call(modelApi.findAll),
            timeout: delay(CONFIG.REQUEST_TIMEOUT)
        }))

        let next = generator.next({
            timeout: true
        })

        expect(next.value).toEqual(put(modelAction.findAllError("Timeout")))
    })

    it("Should find all fail (server)", () => {
        const generator = modelOperation.findAll(modelAction.findAllRequest())
        
        generator.next()

        // Find all models
        expect(generator.next().value).toEqual(race({
            response: call(modelApi.findAll),
            timeout: delay(CONFIG.REQUEST_TIMEOUT)
        }))

        let next = generator.next({
            response: {
                result: null,
                msg: "error"
            }
        })

        expect(next.value).toEqual(put(modelAction.findAllError("error")))

    })

    it("Should find all success", () => {
        const generator = modelOperation.findAll(modelAction.findAllRequest())
        const models  = [{
            id: "1",
            name: "model1"
        }, {
            id: "2",
            name: "model2"
        }]

        generator.next()

        // Find all models
        expect(generator.next().value).toEqual(race({
            response: call(modelApi.findAll),
            timeout: delay(CONFIG.REQUEST_TIMEOUT)
        }))

        let next = generator.next({
            response: {
                result: models,
                msg: null
            }
        })

        expect(next.value).toEqual(put(modelAction.findAllSuccess(models)))
    })

    it("Should start find by id", () => {
        const id = "id"
        const generator = modelOperation.findById(modelAction.findByIdRequest(id))
        
        expect(generator.next().value).toEqual(put(modelAction.findByIdStart()))
    })

    it("Should find by id fail (timeout)", () => {
        const id = "id"
        const generator = modelOperation.findById(modelAction.findByIdRequest(id))
        
        generator.next()

        // Find all projects
        expect(generator.next().value).toEqual(race({
            response: call(modelApi.findById, id),
            timeout: delay(CONFIG.REQUEST_TIMEOUT)
        }))

        let next = generator.next({
            timeout: true
        })

        expect(next.value).toEqual(put(modelAction.findByIdError("Timeout")))
    })

    it("Should find by id fail (server)", () => {
        const id = "id"
        const error = "error"
        const generator = modelOperation.findById(modelAction.findByIdRequest(id))
        
        generator.next()

        // Find all projects
        expect(generator.next().value).toEqual(race({
            response: call(modelApi.findById, id),
            timeout: delay(CONFIG.REQUEST_TIMEOUT)
        }))

        let next = generator.next({
            response: {
                result: null,
                msg: error
            }
        })

        expect(next.value).toEqual(put(modelAction.findByIdError(error)))
    })

    it("Should find by id success", () => {
        const id = "id"
        const currentModel = {
            id,
            name: "model"
        }
        const generator = modelOperation.findById(modelAction.findByIdRequest(id))
        
        generator.next()

        // Find all projects
        expect(generator.next().value).toEqual(race({
            response: call(modelApi.findById, id),
            timeout: delay(CONFIG.REQUEST_TIMEOUT)
        }))

        let next = generator.next({
            response: {
                result: currentModel,
                msg: null
            }
        })

        expect(next.value).toEqual(put(modelAction.findByIdSuccess(currentModel)))
    })

    it("Should start create", () => {
        const modelForm = {
            id: "1",
            name: "name"
        }
        const generator = modelOperation.create(modelAction.createRequest(modelForm))
        
        expect(generator.next().value).toEqual(put(modelAction.createStart()))
    })

    it("Should create fail (timeout)", () => {
        const modelForm = {
            id: "1",
            name: "name"
        }
        const generator = modelOperation.create(modelAction.createRequest(modelForm))
                
        generator.next()

        // Find all projects
        expect(generator.next().value).toEqual(race({
            response: call(modelApi.create, modelForm),
            timeout: delay(CONFIG.REQUEST_TIMEOUT)
        }))

        let next = generator.next({
            timeout: true
        })

        expect(next.value).toEqual(put(modelAction.createError("Timeout")))
    })

    it("Should create fail (server)", () => {
        const modelForm = {
            id: "1",
            name: "name"
        }
        const generator = modelOperation.create(modelAction.createRequest(modelForm))
                
        generator.next()

        // Find all projects
        expect(generator.next().value).toEqual(race({
            response: call(modelApi.create, modelForm),
            timeout: delay(CONFIG.REQUEST_TIMEOUT)
        }))

        let next = generator.next({
            response: {
                result: null,
                msg: "Error"
            }
        })

        expect(next.value).toEqual(put(modelAction.createError("Error")))
    })

    it("Should create success", () => {
        const modelForm = {
            id: "1",
            name: "name"
        }
        const generator = modelOperation.create(modelAction.createRequest(modelForm))
                
        generator.next()

        // Find all projects
        expect(generator.next().value).toEqual(race({
            response: call(modelApi.create, modelForm),
            timeout: delay(CONFIG.REQUEST_TIMEOUT)
        }))

        let next = generator.next({
            response: {
                result: modelForm,
                msg: null
            }
        })

        expect(next.value).toEqual(put(modelAction.createSuccess(modelForm)))
    })

    it("Should update by id start", () => {
        expect(true).toEqual(false)
    })

    it("Should update by id fail (timeout)", () => {
        expect(true).toEqual(false)
    })

    it("Should update by id fail (server)", () => {
        expect(true).toEqual(false)
    })

    it("Should update by id success", () => {
        expect(true).toEqual(false)
    })

    it("Should delete start", () => {
        const id = "id"
        const generator = modelOperation.deleteById(modelAction.deleteByIdRequest(id))
        
        expect(generator.next().value).toEqual(put(modelAction.deleteStart()))
    })

    it("Should delete fail (timeout)", () => {
        const id = "id"
        const generator = modelOperation.deleteById(modelAction.deleteByIdRequest(id))
        
        generator.next()

        expect(generator.next().value).toEqual(race({
            response: call(modelApi.deleteById, id),
            timeout: delay(CONFIG.REQUEST_TIMEOUT)
        }))

        let next = generator.next({
            timeout: true
        })

        expect(next.value).toEqual(put(modelAction.deleteError("Timeout")))
    })

    it("Should delete fail (server)", () => {
        const id = "id"
        const generator = modelOperation.deleteById(modelAction.deleteByIdRequest(id))
        
        generator.next()

        expect(generator.next().value).toEqual(race({
            response: call(modelApi.deleteById, id),
            timeout: delay(CONFIG.REQUEST_TIMEOUT)
        }))

        let next = generator.next({
            response: {
                result: null,
                msg: "Error"
            }
        })

        expect(next.value).toEqual(put(modelAction.deleteError("Error")))
    })

    it("Should delete success", () => {
        const id = "id"
        const generator = modelOperation.deleteById(modelAction.deleteByIdRequest(id))
        
        generator.next()

        expect(generator.next().value).toEqual(race({
            response: call(modelApi.deleteById, id),
            timeout: delay(CONFIG.REQUEST_TIMEOUT)
        }))

        let next = generator.next({
            response: {
                result: id,
                msg: null
            }
        })

        expect(next.value).toEqual(put(modelAction.deleteSuccess(id)))
    })

})

let DEFAULT_STATE = {
    find: {
        loading: false,
        models: [],
        currentModel: null,
        error: null
    },
    create: {
        loading: false,
        createdModel: null,
        error: null
    },
    update: {
        loading: false,
        updatedModel: null,
        error: null,
    },
    delete: {
        loading: false,
        success: false,
        error: null
    }
}

describe("Find reducers", () => {
    it("Should return default state", () => {
        expect(modelReducer(undefined, {})).toEqual(DEFAULT_STATE)
    })

    it("Should handle find all start", () => {
        const new_state = {
            ...DEFAULT_STATE,
            find: {
                loading: true,
                models: [],
                currentModel: null,
                error: null
            }
        }

        expect(modelReducer(DEFAULT_STATE, modelAction.findAllStart())).toEqual(new_state)        
    })

    it("Should handle find all error", () => {
        const prevState = {
            ...DEFAULT_STATE,
            find: {
                loading: true,
                models: [],
                error: null
            }
        }

        const newState = {
            ...prevState,
            find: {
                loading: false,
                models: [],
                error: "Error"
            }
        }

        expect(modelReducer(prevState, modelAction.findAllError("Error"))).toEqual(newState)        

    })

    it("Should handle find all success", () => {
        const prevState = {
            ...DEFAULT_STATE,
            find: {
                loading: true,
                models: [],
                error: null
            }
        }

        const models  = [{
            id: "1",
            name: "model1"
        }, {
            id: "2",
            name: "model2"
        }]

        const newState = {
            ...prevState,
            find: {
                loading: false,
                models,
                error: null
            }
        }

        expect(modelReducer(prevState, modelAction.findAllSuccess(models))).toEqual(newState)
    })

    it("Should handle clear find error", () => {
        const prevState = {
            ...DEFAULT_STATE,
            find: {
                loading: false,
                models: [],
                error: "Error"
            }
        }


        const newState = {
            ...prevState,
            find: {
                loading: false,
                models: [],
                error: null
            }
        }

        expect(modelReducer(prevState, modelAction.clearFindError())).toEqual(newState)

    })

    it("Should handle find by id start", () => {
        const prevState = {
            ...DEFAULT_STATE,
            find: {
                loading: false,
                models: [{id: "1", name: "model1"}],
                currentModel: null,
                error: null
            }
        }


        const newState = {
            ...prevState,
            find: {
                ...prevState.find,
                loading: true,
            }
        }

        expect(modelReducer(prevState, modelAction.findByIdStart())).toEqual(newState)
    })

    it("Should handle find by id error", () => {
        const prevState = {
            ...DEFAULT_STATE,
            find: {
                loading: true,
                models: [{id: "1", name: "model1"}],
                currentModel: null,
                error: null
            }
        }


        const newState = {
            ...prevState,
            find: {
                ...prevState.find,
                loading: false,
                error: "Error"
            }
        }

        expect(modelReducer(prevState, modelAction.findByIdError("Error"))).toEqual(newState)
    })  

    it("Should handle find by id success", () => {
        const prevState = {
            ...DEFAULT_STATE,
            find: {
                loading: true,
                models: [{id: "1", name: "model1"}],
                currentModel: null,
                error: null
            }
        }


        const newState = {
            ...prevState,
            find: {
                ...prevState.find,
                loading: false,
                currentModel: {id: "1", name: "model1"},
            }
        }

        expect(modelReducer(prevState, modelAction.findByIdSuccess({id: "1", name: "model1"}))).toEqual(newState)
    })

    it("Should handle clear find by id", () => {
        const prevState1 = {
            ...DEFAULT_STATE,
            find: {
                loading: false,
                models: [{id: "1", name: "model1"}],
                currentModel: {id: "1", name: "model1"},
                error: null
            }
        }

        const prevState2 = {
            ...DEFAULT_STATE,
            find: {
                loading: false,
                models: [{id: "1", name: "model1"}],
                currentModel: null,
                error: "Error"
            }
        }

        const newState = {
            ...prevState1,
            find: {
                ...prevState1.find,
                loading: false,
                currentModel: null,
                error: null
            }
        }

        expect(modelReducer(prevState1, modelAction.clearFindById())).toEqual(newState)
        expect(modelReducer(prevState2, modelAction.clearFindById())).toEqual(newState)

    })

    it("Should handle create start", () => {
        const prevState = {
            ...DEFAULT_STATE,
            find: {
                ...DEFAULT_STATE.find,
                models: [{id: "1", name: "model1"}],
            }
        }


        const newState = {
            ...prevState,
            create: {
                ...DEFAULT_STATE.create,
                loading: true
            }
        }

        expect(modelReducer(prevState, modelAction.createStart())).toEqual(newState)
    })

    it("Should handle create error", () => {
        const prevState = {
            ...DEFAULT_STATE,
            find: {
                ...DEFAULT_STATE.find,
                models: [{id: "1", name: "model1"}],
            },
            create: {
                ...DEFAULT_STATE.create,
                loading: true
            }
        }


        const newState = {
            ...prevState,
            create: {
                createdModel: null,
                error: "Error",
                loading: false
            }
        }

        expect(modelReducer(prevState, modelAction.createError("Error"))).toEqual(newState)
    })

    it("Should handle create success", () => {
        const prevState = {
            ...DEFAULT_STATE,
            find: {
                ...DEFAULT_STATE.find,
                models: [{id: "1", name: "model1"}],
            },
            create: {
                ...DEFAULT_STATE.create,
                loading: true
            }
        }

        const createdModel = {id: "2", name: "model2"}
        const newState = {
            ...prevState,
            find: {
                ...prevState.find,
                models: [...prevState.find.models, createdModel],
            },
            create: {
                createdModel,
                error: null,
                loading: false
            }
        }

        expect(modelReducer(prevState, modelAction.createSuccess(createdModel))).toEqual(newState)
    })

    it("Should handle clear create", () => {
        const prevState1 = {
            ...DEFAULT_STATE,
            find: {
                ...DEFAULT_STATE.find,
                models: [{id: "1", name: "model1"}],
            },
            create: {
                createdModel: {id: "2", name: "model2"},
                error: null,
                loading: false
            }
        }

        const prevState2 = {
            ...DEFAULT_STATE,
            find: {
                ...DEFAULT_STATE.find,
                models: [{id: "1", name: "model1"}],
            },
            create: {
                createdModel: null,
                error: "Error",
                loading: false
            }
        }


        const newState = {
            ...prevState1,
            create: {
                createdModel: null,
                error: null,
                loading: false
            }
        }

        expect(modelReducer(prevState1, modelAction.clearCreate())).toEqual(newState)
        expect(modelReducer(prevState2, modelAction.clearCreate())).toEqual(newState)

    })

    it("Should handle update start", () => {
        expect(true).toEqual(false)
    })

    it("Should handle update error", () => {
        expect(true).toEqual(false)
    })

    it("Should handle update success", () => {
        expect(true).toEqual(false)
    })

    it("Should handle clear update", () => {
        expect(true).toEqual(false)
    })


    it("Should handle delete start", () => {
        const prevState = {
            ...DEFAULT_STATE,
            find: {
                ...DEFAULT_STATE.find,
                models: [{id: "1", name: "model1"}],
            }
        }

        const newState = {
            ...prevState,
            delete: {
                loading: true,
                success: false,
                error: null,
            }
        }

        expect(modelReducer(prevState, modelAction.deleteStart())).toEqual(newState)
    })

    it("Should handle delete error", () => {
        const prevState = {
            ...DEFAULT_STATE,
            find: {
                ...DEFAULT_STATE.find,
                models: [{id: "1", name: "model1"}],
            }, 
            delete: {
                loading: true,
                success: false,
                error: null,
            }
        }

        const newState = {
            ...prevState,
            delete: {
                loading: false,
                success: false,
                error: "Error",
            }
        }

        expect(modelReducer(prevState, modelAction.deleteError("Error"))).toEqual(newState)
    })

    it("Should handle delete success", () => {
        const prevState = {
            ...DEFAULT_STATE,
            find: {
                ...DEFAULT_STATE.find,
                models: [{_id: "1", name: "model1"}],
            }, 
            delete: {
                loading: true,
                success: false,
                error: null,
            }
        }

        const newState = {
            ...prevState,
            find: {
                ...prevState.find,
                models: [],
            }, 

            delete: {
                loading: false,
                success: true,
                error: null,
            }
        }

        expect(modelReducer(prevState, modelAction.deleteSuccess("1"))).toEqual(newState)
    })

    it("Should handle clear delete", () => {
        const prevState1 = {
            ...DEFAULT_STATE,
            delete: {
                error: null,
                loading: false,
                success: true,
            }
        }

        const prevState2 = {
            ...DEFAULT_STATE,
            delete: {
                success: false,
                error: "Error",
                loading: false
            }
        }


        const newState = {
            ...prevState1,
            delete: {
                success: false,
                error: null,
                loading: false
            }
        }

        expect(modelReducer(prevState1, modelAction.clearDelete())).toEqual(newState)
        expect(modelReducer(prevState2, modelAction.clearDelete())).toEqual(newState)

    })
})