import { put, call, delay, race, select } from 'redux-saga/effects'

import * as projectType from './types.js'
import * as projectAction from './actions'
import * as projectOperation from './operations'
import * as projectApi from './apis'
import { projectReducer } from './reducers'
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
        expect(true).toEqual(false)
    })

    it("Should create action to start find by id process", () => {
        expect(true).toEqual(false)
    })

    it("Should create action for find by id success", () => {
        expect(true).toEqual(false)
    })

    it("Should create action for find by id error", () => {
        expect(true).toEqual(false)
    })

    it("Should create action to create", () => {
        expect(true).toEqual(false)
    })

    it("Should create action to start create process", () => {
        expect(true).toEqual(false)
    })

    it("Should create action for create success", () => {
        expect(true).toEqual(false)
    })

    it("Should create action for create error", () => {
        expect(true).toEqual(false)
    })

    it("Should create action to clear error", () => {
        expect(true).toEqual(false)
    })
})

describe("Project operations (sagas)", () => {
    it("Should find all fail (connection)", () => {
        expect(true).toEqual(false)
    })

    it("Should find all fail (server)", () => {
        expect(true).toEqual(false)
    })

    it("Should find all success", () => {
        expect(true).toEqual(false)
    })

    it("Should find by id fail (connection)", () => {
        expect(true).toEqual(false)
    })

    it("Should find by id fail (server)", () => {
        expect(true).toEqual(false)
    })

    it("Should find by id success", () => {
        expect(true).toEqual(false)
    })

    it("Should create fail (connection)", () => {
        expect(true).toEqual(false)
    })

    it("Should create fail (server)", () => {
        expect(true).toEqual(false)
    })

    it("Should create success", () => {
        expect(true).toEqual(false)
    })

    it("Should delete fail (connection)", () => {
        expect(true).toEqual(false)
    })

    it("Should delete fail (server)", () => {
        expect(true).toEqual(false)
    })

    it("Should delete success", () => {
        expect(true).toEqual(false)
    })

})

describe("Project reducer", () => {
    it("Should return default state", () => {
        expect(true).toEqual(false)
    })

    it("Should handle find all start", () => {
        expect(true).toEqual(false)
    })

    it("Should handle find all error", () => {
        expect(true).toEqual(false)
    })

    it("Should handle find all success", () => {
        expect(true).toEqual(false)
    })

    it("Should handle find by id start", () => {
        expect(true).toEqual(false)
    })

    it("Should handle find by id error", () => {
        expect(true).toEqual(false)
    })

    it("Should handle find by id success", () => {
        expect(true).toEqual(false)
    })

    it("Should handle create start", () => {
        expect(true).toEqual(false)
    })

    it("Should handle create error", () => {
        expect(true).toEqual(false)
    })

    it("Should handle create success", () => {
        expect(true).toEqual(false)
    })

    it("Should handle delete start", () => {
        expect(true).toEqual(false)
    })

    it("Should handle delete error", () => {
        expect(true).toEqual(false)
    })

    it("Should handle delete success", () => {
        expect(true).toEqual(false)
    })

    it("Should handle clear error", () => {
        expect(true).toEqual(false)
    })

})