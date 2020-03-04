import { put, call, delay, race, select } from 'redux-saga/effects'

import * as fileType from './types.js'
import * as fileAction from './actions'
import * as fileOperation from './operations'
import * as fileApi from './apis'
import fileReducer from './reducers'
import { CONFIG } from '../../globals'

describe("File actions", () => {
    it("Should create action to perform find file by id request", () => {
        const expectAction = {
            type: fileType.FIND_BY_ID_REQUEST,
            payload: {
                id: 1,
                projectId: 2
            }
        }

        expect(fileAction.findByIdRequest(1, 2)).toEqual(expectAction)
    })

    it("Should create action to start find by id", () => {
        const expectAction = {
            type: fileType.FIND_BY_ID_START,
        }

        expect(fileAction.findByIdStart()).toEqual(expectAction)

    })

    it("Should create action for find by id error", () => {
        const expectAction = {
            type: fileType.FIND_BY_ID_ERROR,
            payload: {
                error: "error"
            }
        }

        expect(fileAction.findByIdError("error")).toEqual(expectAction)
    })

    it("Should create action for find by id success", () => {
        const currentFile = {
            id: "1",
            name: "file1"
        }

        const expectAction = {
            type: fileType.FIND_BY_ID_SUCCESS,
            payload: {
                currentFile
            }
        }

        expect(fileAction.findByIdSuccess(currentFile)).toEqual(expectAction)
    })

    it("Should create action to clear find by id", () => {
        const expectAction = {
            type: fileType.CLEAR_FIND_ERROR,
        }

        expect(fileAction.clearFindError()).toEqual(expectAction)

    })

    it("Should create action to perform predict file by id", () => {
        const expectAction = {
            type: fileType.PREDICT_BY_ID_REQUEST,
            payload: {
                id: "1",
                modelId: "2"
            }
        }

        expect(fileAction.predictByIdRequest("1", "2")).toEqual(expectAction)
    })

    it("Should create action to start predict by id", () => {
        const expectAction = {
            type: fileType.PREDICT_BY_ID_START,
        }

        expect(fileAction.predictByIdStart()).toEqual(expectAction)

    })

    it("Should create action for predict by id error", () => {
        const expectAction = {
            type: fileType.PREDICT_BY_ID_ERROR,
            payload: {
                error: "error"
            }
        }

        expect(fileAction.predictByIdError("error")).toEqual(expectAction)
    })

    it("Should create action for predict by id success", () => {
        const updatedFile = {
            id: "2",
            name: "file2"
        }
        const expectAction = {
            type: fileType.PREDICT_BY_ID_SUCCESS,
            payload: {
                updatedFile
            }
        }

        expect(fileAction.predictByIdSuccess(updatedFile)).toEqual(expectAction)

    })

    it("Should create action for clear predict by id", () => {
        const expectAction = {
            type: fileType.CLEAR_PREDICT_ERROR,
        }

        expect(fileAction.clearPredictError()).toEqual(expectAction)
    })
})

describe("File operations (sagas)", () => {
    it("Should start find by id", () => {
        const id = "1"
        const projectId = "2"
        const generator = fileOperation.findById(fileAction.findByIdRequest(id, projectId))
        
        expect(generator.next().value).toEqual(put(fileAction.findByIdStart()))
    })

    it("Should find by id fail (timeout)", () => {
        const id = "1"
        const projectId = "2"
        const generator = fileOperation.findById(fileAction.findByIdRequest(id, projectId))
        
        generator.next()

        // Find project by id
        expect(generator.next().value).toEqual(race({
            response: call(fileApi.findById, id, projectId),
            timeout: delay(CONFIG.REQUEST_TIMEOUT)
        }))

        let next = generator.next({
            timeout: true
        })

        expect(next.value).toEqual(put(fileAction.findByIdError("Timeout")))
    })

    it("Should find by id fail (server)", () => {
        const id = "1"
        const projectId = "2"
        const generator = fileOperation.findById(fileAction.findByIdRequest(id, projectId))
        
        generator.next()

        // Find project by id
        expect(generator.next().value).toEqual(race({
            response: call(fileApi.findById, id, projectId),
            timeout: delay(CONFIG.REQUEST_TIMEOUT)
        }))

        let next = generator.next({
            response: {
                result: null,
                msg: "error"
            }
        })

        expect(next.value).toEqual(put(fileAction.findByIdError("error")))

    })

    it("Should find by id success", () => {
        const id = "1"
        const projectId = "2"
        const generator = fileOperation.findById(fileAction.findByIdRequest(id, projectId))
        const currentFile = {
            id: "1",
            name: "test1"
        }

        generator.next()

        // Find project by id
        expect(generator.next().value).toEqual(race({
            response: call(fileApi.findById, id, projectId),
            timeout: delay(CONFIG.REQUEST_TIMEOUT)
        }))

        let next = generator.next({
            response: {
                result: currentFile,
                msg: null
            }
        })

        expect(next.value).toEqual(put(fileAction.findByIdSuccess(currentFile)))
    })

    it("Should start predict by id", () => {
        const id = "1"
        const modelId = "2"
        const generator = fileOperation.predictById(fileAction.predictByIdRequest(id, modelId))
        
        expect(generator.next().value).toEqual(put(fileAction.predictByIdStart()))

    })

    it("Should predict by id fail (timeout)", () => {
        const id = "1"
        const modelId = "2"
        const generator = fileOperation.predictById(fileAction.predictByIdRequest(id, modelId))
        
        generator.next()

        // Find project by id
        expect(generator.next().value).toEqual(race({
            response: call(fileApi.predictById, id, modelId),
            timeout: delay(CONFIG.REQUEST_TIMEOUT)
        }))

        let next = generator.next({
            timeout: true
        })

        expect(next.value).toEqual(put(fileAction.predictByIdError("Timeout")))

    })

    it("Should predict by id fail (server)", () => {
        const id = "1"
        const modelId = "2"
        const generator = fileOperation.predictById(fileAction.predictByIdRequest(id, modelId))
        
        generator.next()

        // Find project by id
        expect(generator.next().value).toEqual(race({
            response: call(fileApi.predictById, id, modelId),
            timeout: delay(CONFIG.REQUEST_TIMEOUT)
        }))

        let next = generator.next({
            response: {
                result: null,
                msg: "Error"
            }
        })

        expect(next.value).toEqual(put(fileAction.predictByIdError("Error")))
    })

    it("Should predict by id success", () => {
        const id = "1"
        const modelId = "2"
        const result = {
            id: "1",
            name: "test1"
        }
        
        const generator = fileOperation.predictById(fileAction.predictByIdRequest(id, modelId))
        
        generator.next()

        // Find project by id
        expect(generator.next().value).toEqual(race({
            response: call(fileApi.predictById, id, modelId),
            timeout: delay(CONFIG.REQUEST_TIMEOUT)
        }))

        let next = generator.next({
            response: {
                result,
                msg: null
            }
        })

        expect(next.value).toEqual(put(fileAction.predictByIdSuccess(result)))

    })
})

let DEFAULT_STATE = {
    find: {
        loading: false,
        currentFile: null,
        error: null
    },
    predict: {
        loading: false,
        updatedFile: null,
        error: null
    }
}
describe("File reducers", () => {
    it("Should return default state", () => {
        expect(fileReducer(undefined, {})).toEqual(DEFAULT_STATE)
    })

    it("Should handle find by id start", () => {
        const new_state = {
            ...DEFAULT_STATE,
            find: {
                loading: true,
                currentFile: null,
                error: null
            }
        }

        expect(fileReducer(DEFAULT_STATE, fileAction.findByIdStart())).toEqual(new_state)        
    })

    it("Should handle find by id error", () => {
        const prevState = {
            ...DEFAULT_STATE,
            find: {
                loading: true,
                currentFile: null,
                error: null
            }
        }

        const newState = {
            ...prevState,
            find: {
                loading: false,
                currentFile: null,
                error: "Error"
            }
        }

        expect(fileReducer(prevState, fileAction.findByIdError("Error"))).toEqual(newState)        

    })

    it("Should handle find by id success", () => {
        const prevState = {
            ...DEFAULT_STATE,
            find: {
                loading: true,
                currentFile: null,
                error: null
            }
        }

        const currentFile = {
            id: "1",
            name: "test1"
        }

        const newState = {
            ...prevState,
            find: {
                loading: false,
                currentFile,
                error: null
            }
        }

        expect(fileReducer(prevState, fileAction.findByIdSuccess(currentFile))).toEqual(newState)
    })

    it("Should handle clear find error", () => {
        const prevState = {
            ...DEFAULT_STATE,
            find: {
                loading: false,
                currentFile: null,
                error: "Error"
            }
        }


        const newState = {
            ...prevState,
            find: {
                loading: false,
                currentFile: null,
                error: null
            }
        }

        expect(fileReducer(prevState, fileAction.clearFindError())).toEqual(newState)

    })

    it("Should handle predict by id start", () => {
        const new_state = {
            ...DEFAULT_STATE,
            predict: {
                loading: true,
                updatedFile: null,
                error: null
            }
        }

        expect(fileReducer(DEFAULT_STATE, fileAction.predictByIdStart("1", "2"))).toEqual(new_state)        


    })

    it("Should handle predict by id error", () => {
        const prevState = {
            ...DEFAULT_STATE,
            predict: {
                loading: true,
                updatedFile: null,
                error: null
            }
        }

        const newState = {
            ...prevState,
            predict: {
                loading: false,
                updatedFile: null,
                error: "Error"
            }
        }

        expect(fileReducer(prevState, fileAction.predictByIdError("Error"))).toEqual(newState)        

    })

    it("Should handle predict by id success", () => {
        const prevState = {
            ...DEFAULT_STATE,
            predict: {
                loading: true,
                updatedFile: null,
                error: null
            }
        }

        const updatedFile = {
            id: "1",
            name: "test1"
        }

        const newState = {
            ...prevState,
            predict: {
                loading: false,
                updatedFile,
                error: null
            }
        }

        expect(fileReducer(prevState, fileAction.predictByIdSuccess(updatedFile))).toEqual(newState)

    })

    it("Should handle clear predict error", () => {
        const prevState = {
            ...DEFAULT_STATE,
            predict: {
                loading: false,
                updatedFile: null,
                error: "Error"
            }
        }


        const newState = {
            ...prevState,
            predict: {
                loading: false,
                updatedFile: null,
                error: null
            }
        }

        expect(fileReducer(prevState, fileAction.clearPredictError())).toEqual(newState)

    })
})