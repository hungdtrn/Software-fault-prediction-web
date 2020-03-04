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

    it("Should create action to clear find all", () => {
        const expectAction = {
            type: modelType.CLEAR_FIND_ERROR,
        }

        expect(modelAction.clearFindError()).toEqual(expectAction)

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
})

let DEFAULT_STATE = {
    find: {
        loading: false,
        models: [],
        error: null
    },
}

describe("File reducers", () => {
    it("Should return default state", () => {
        expect(modelReducer(undefined, {})).toEqual(DEFAULT_STATE)
    })

    it("Should handle find all start", () => {
        const new_state = {
            ...DEFAULT_STATE,
            find: {
                loading: true,
                models: [],
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
})