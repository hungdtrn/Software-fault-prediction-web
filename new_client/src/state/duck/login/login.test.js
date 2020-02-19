import sinon from "sinon";
import { put, call, delay, race, select } from 'redux-saga/effects'

import * as loginTypes from './types'
import * as loginActions from './actions'
import * as loginOperations from './operations'
import * as loginApis from './apis'
import { loginReducer } from './reducers'
import { CONFIG } from '../../globals'

const userForm = {
    user: {
        username: "test",
        password: "test",
    },
    remember: true
};

const FAKELOGINRESPONE = {
    "wrongCredential": {
        msg: "Wrong credential",
        result: null
    }, 
    "success": {
        msg: "",
        result: "fake access token"
    }
}


describe("Login Actions", () => {
    it("Should create an action to submit login form", () => {
        const expectedAction = {
            type: loginTypes.LOGIN,
            payload: userForm
        }
        expect(loginActions.loginRequest(userForm)).toEqual(expectedAction)
    })

    it("Should create action for starting login for showing spiner", () => {
        expect(loginActions.loginStart()).toEqual({
            type: loginTypes.LOGIN_START
        })
    })

    it("Should create an action for login error", () => {
        const expectedAction = {
            type: loginTypes.LOGIN_ERROR,
            payload: {
                error: "test error"
            }
        }
        expect(loginActions.loginError("test error")).toEqual(expectedAction)
    })

    it("Should create action for clear error", () => {
        expect(loginActions.clearError()).toEqual({
            type: loginTypes.LOGIN_CLEAR_ERROR
        })
    })

    it("Should create an action for login success", () => {
        const expectedAccessToken = "dfasHKJ324230";
        const expectedRemember = true;

        const expectedAction = {
            type: loginTypes.LOGIN_SUCCESS,
            payload: {
                accessToken: expectedAccessToken,
                remember: expectedRemember
            }
        }

        expect(loginActions.loginSuccess(expectedAccessToken, expectedRemember))
            .toEqual(expectedAction)
    })

})

describe("Login operations (sagas)", () => {
    it("Should login failed", () => {
        const ACTIONLOGIN = loginActions.loginRequest(userForm)
        const generator = loginOperations.login(ACTIONLOGIN)
        // Start login
        expect(generator.next().value).toEqual(put(loginActions.loginStart()))

        // Login with fake username password
        expect(generator.next().value).toEqual(race({
            response: call(loginApis.login, ACTIONLOGIN.payload.user),
            timeout: delay(CONFIG.REQUEST_TIMEOUT)
        }))

        // Should call LoginError action
        let next = generator.next({
            response: FAKELOGINRESPONE["wrongCredential"],
        })
        expect(next.value).toEqual(put(loginActions.loginError(FAKELOGINRESPONE["wrongCredential"].msg)))
    })

    it("Should login time out", () => {
        const ACTIONLOGIN = loginActions.loginRequest(userForm)
        const generator = loginOperations.login(ACTIONLOGIN)

        // Dispatch login start
        expect(generator.next().value).toEqual(put(loginActions.loginStart()))

        // Login with fake username password
        expect(generator.next().value).toEqual(race({
            response: call(loginApis.login, ACTIONLOGIN.payload.user),
            timeout: delay(CONFIG.REQUEST_TIMEOUT)
        }))

        // Should call LoginError action
        let next = generator.next({
            timeout: true,
        })

        expect(next.value).toEqual(put(loginActions.loginError("Timeout")))
    })

    it("Should login success", () => {
        const ACTIONLOGIN = loginActions.loginRequest(userForm)
        const generator = loginOperations.login(ACTIONLOGIN)
        
        // Dispatch login start
        expect(generator.next().value).toEqual(put(loginActions.loginStart()))

        // Login with fake username password
        expect(generator.next().value).toEqual(race({
            response: call(loginApis.login, ACTIONLOGIN.payload.user),
            timeout: delay(CONFIG.REQUEST_TIMEOUT)
        }))

        // Should call LoginError action
        // let next = generator.next()
        let next = generator.next({
            response: FAKELOGINRESPONE["success"]
        })

        expect(next.value).toEqual(put(loginActions.loginSuccess(FAKELOGINRESPONE["success"].result, userForm.remember)))
    })

})

describe("Login reducers", () => {
    it("Should return default state", () => {
        expect(loginReducer(undefined, {})).toEqual({
            loading: false,
            accessToken: null,
            error: null,
        })
    })

    it("Should handle login error", () => {
        expect(loginReducer({}, loginActions.loginError("Error"))).toEqual({
            loading: false,
            accessToken: null,
            error: "Error"
        })
    })

    it("Should handle clear error", () => {
        expect(loginReducer({
            error: "Error",
            loading: false,
            accessToken: null,
        }, loginActions.clearError())).toEqual({
            loading: false,
            accessToken: null,
            error: null
        })
    })

    it("Should handle login success", () => {
        expect(loginReducer({}, loginActions.loginSuccess("Token", true))).toEqual({
            accessToken: "Token",
            error: null,
            loading: false
        })

        expect(loginReducer({}, loginActions.loginSuccess("Token", false))).toEqual({
            accessToken: "Token",
            error: null,
            loading: false
        })
    })
})