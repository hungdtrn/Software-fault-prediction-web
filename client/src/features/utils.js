import React from 'react'
import { Modal, Spin } from 'antd'
import jwt from 'jsonwebtoken'

export const Loading = (props) => {
    return (
        <Modal
            title="Loading"
            visible={props.visible}
            okButtonProps={{ disabled: true }}
            cancelButtonProps = {{ disabled: true }}
        >
            <Spin />
        </Modal>
    )
}

export const ErrorMessage = (props) => {
    return (
        <Modal
            title="Errors happened"
            visible={props.visible}
            onOk={props.onOk}
            onCancel={props.onCancel}
        >
            {props.error}
        </Modal>
    )
}

export const getAccessToken = () => {
    let accessToken = localStorage.getItem("accessToken")
    if (!accessToken) accessToken = sessionStorage.getItem("accessToken")

    return accessToken
}

export const decodeToken = (token) => {
    return jwt.decode(token)
}