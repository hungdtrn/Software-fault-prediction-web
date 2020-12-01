import React from 'react'
import { Route, Redirect, Switch } from 'react-router-dom';

import { userRouters } from '../../routes'
import BackboneLayout from './backbone'

const UserLayout = ( ) => {
    const defaultComponent = userRouters.find(( el ) => {
        return el.default
    })

    const routes = [{
        path: "/",
        component: () => (<Redirect to={defaultComponent.path}/>),
        exact: true
    }, ...userRouters]
    
    const content =  (
        <Switch>
            {
                routes.map(( route ) => (
                    <Route key={route.path} {...route} />
                ))
            }
        </Switch>
    )    

    const siders = userRouters.filter(i => !(i.path) || i.path != "*").map((route, i) => {
        return {
            key: i.toString(),
            icon: route.icon,
            name: route.name,
            path: route.path
        }
    })

    return (<BackboneLayout content={content} siders={siders}/>)
}

export default UserLayout