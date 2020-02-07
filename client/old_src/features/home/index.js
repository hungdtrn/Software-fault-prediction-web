import React from 'react'
import { getAccessToken, decodeToken } from '../utils'
import { Redirect } from 'react-router-dom'


class Home extends React.Component {
    render() {
        const accessToken = getAccessToken()
        console.log(accessToken)

        if (!accessToken) return <Redirect to="/login"/>
        else {
            const userInfo = decodeToken(accessToken)
            const userRole = userInfo.role
            console.log(userRole)
            if (userRole == "user") {
                return <Redirect to="/projects"/>
            } else if (userRole == "admin") {
                return <Redirect to="/models"/>
            }

            return <Redirect to="/login" />
        }

    }
}


export default Home