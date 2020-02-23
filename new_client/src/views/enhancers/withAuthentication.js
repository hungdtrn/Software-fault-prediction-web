import React from "react";
import { Redirect } from "react-router-dom";

import { getToken } from '../../state/utils/token'


export default function withAuthentication( WrappedComponent ) {
    const accessToken = getToken()

    const wrappedAuthentication = ( props ) => {
        if (!accessToken) {
            return <Redirect to="/login" />
        }
        return ( <WrappedComponent { ...props } accessToken={accessToken} /> ) 
    }

    return wrappedAuthentication
}
