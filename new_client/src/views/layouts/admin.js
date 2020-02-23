import React from 'react'
import { Route, Redirect, Switch } from 'react-router-dom';

import { adminRoutes } from '../../routes'
import BackboneLayout from './backbone'

const AdminLayout = ( ) => {
    const defaultComponent = adminRoutes.find(( el ) => {
        return el.default
    })

    const routes = [...adminRoutes, {
        path: "/",
        component: () => (<Redirect to={defaultComponent.path}/>),
        exact: true
    }]
    
    const content =  (
        <Switch>
            {
                routes.map(( route ) => (
                    <Route key={route.path} {...route} />
                ))
            }
        </Switch>
    )    

    const siders = adminRoutes.filter(i => !(i.path) || i.path != "*").map((route, i) => {
        return {
            key: i.toString(),
            icon: route.icon,
            name: route.name,
            path: route.path
        }
    })

    return <BackboneLayout content={content} siders={siders}/>
}

export default AdminLayout