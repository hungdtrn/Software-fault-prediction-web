import React from 'react';
import { Layout } from 'antd'
import { Link, Route } from 'react-router-dom';
import { generalRoutes } from '../../routes'

const  { Header, Content, Footer } = Layout
const App = ( ) => (
    <Layout>
        <Content>
            { generalRoutes.map( route => (
                <Route key={ route.path } { ...route } />
            ) ) }
        </Content>
    </Layout>
)

export default App