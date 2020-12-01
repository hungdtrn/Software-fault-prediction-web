import sinon from "sinon";
import { put, call, delay, race, select } from 'redux-saga/effects'

import * as registerType from './types.js'
import * as registerAction from './actions'
import * as registerOperation from './operations'
import * as registerApi from './apis'
import { registerReducer } from './reducers'
import { CONFIG } from '../../globals'

const REQUESTFORM = {
    username: "test",
    password: "test",
    email: "test@test.com"
}

describe("Register Actions", () => {
    it("Should create action to submit register form", () => {
        const expectedAction = {
            type: registerType.REGISTER_REQUEST,
            payload: {
                user: REQUESTFORM
            }
        }

        expect(registerAction.registerRequest(REQUESTFORM)).toEqual(expectedAction)
    })

    it("Should create action to start register process", () => {
        const expectedAction = {
            type: registerType.REGISTER_START
        }

        expect(registerAction.registerStart()).toEqual(expectedAction)
    })

    it("Should create action for register success", () => {
        const accessToken = "etestst"

        const expectedAction = {
            type: registerType.REGISTER_SUCCESS,
            payload: {
                accessToken
            }
        }

        expect(registerAction.registerSuccess(accessToken)).toEqual(expectedAction)
    })

    it("Should create action for register error", () => {
        const expectedError = "dfafafasdf"
        const expectedAction = {
            type: registerType.REGISTER_ERROR,
            payload: {
                error: expectedError
            }
        }

        expect(registerAction.registerError(expectedError)).toEqual(expectedAction)
    })

    it("Should create action to clear error", () => {
        const expectedAction = {
            type: registerType.REGISTER_CLEAR_ERROR,
        }

        expect(registerAction.clearError()).toEqual(expectedAction)
    })
})

describe("Register operations (sagas)", () => {
    it("Should register failed (connection)", () => {
        const actionRegister = registerAction.registerRequest(REQUESTFORM)
        const generator = registerOperation.register(actionRegister)

        // Dispatch register start
        expect(generator.next().value).toEqual(put(registerAction.registerStart()))
            
        expect(generator.next().value).toEqual(race({
            response: call(registerApi.register, actionRegister.payload.user),
            timeout: delay(CONFIG.REQUEST_TIMEOUT)
        }))

        // Should timeout
        let next = generator.next({
            timeout: true
        })
        
        expect(next.value).toEqual(put(registerAction.registerError("Timeout")))
    })

    it("Should regiter failed (server response)", () => {
        const actionRegister = registerAction.registerRequest(REQUESTFORM)
        const generator = registerOperation.register(actionRegister)

        // Dispatch register start
        expect(generator.next().value).toEqual(put(registerAction.registerStart()))
            
        expect(generator.next().value).toEqual(race({
            response: call(registerApi.register, actionRegister.payload.user),
            timeout: delay(CONFIG.REQUEST_TIMEOUT)
        }))

        // Server response
        let next = generator.next({
            response: {
                msg: "Server error",
                result: null
            }
        })

        expect(next.value).toEqual(put(registerAction.registerError("Server error")))
    })
    
    it("Should register success", () => {
        const actionRegister = registerAction.registerRequest(REQUESTFORM)
        const generator = registerOperation.register(actionRegister)

        // Dispatch register start
        expect(generator.next().value).toEqual(put(registerAction.registerStart()))
            
        expect(generator.next().value).toEqual(race({
            response: call(registerApi.register, actionRegister.payload.user),
            timeout: delay(CONFIG.REQUEST_TIMEOUT)
        }))

        // Server response
        let next = generator.next({
            response: {
                msg: "",
                result: "accessToken"
            }
        })

        expect(next.value).toEqual(put(registerAction.registerSuccess("accessToken")))
    })
})

describe("Register reducers", () => {
    it("Should return default states", () => {
        expect(registerReducer(undefined, {})).toEqual({
            loading: false,
            success: false,
            error: null,
        })

    })

    it("Should handle register start", () => {
        expect(registerReducer({}, registerAction.registerStart())).toEqual({
            loading: true,
            success: false,
            error: null
        })
    })

    it("Should handle register error", () => {
        expect(registerReducer({}, registerAction.registerError("Error"))).toEqual({
            loading: false,
            success: false,
            error: "Error"
        })
    })

    it("Should handle clear error", () => {
        expect(registerReducer({
            loading: false,
            success: false,
            error: "Error"
        }, registerAction.clearError())).toEqual({
            loading: false,
            success: false,
            error: null
        })

    })

    it("Should handle register success", () => {
        expect(registerReducer({
            loading: true,
            success: false,
            error: ""
        }, registerAction.registerSuccess("token"))).toEqual({
            loading: false,
            success: true,
            error: null
        })
    })
})