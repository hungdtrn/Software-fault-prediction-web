import React from 'react';
import { Layout } from 'antd'
import { Link, Route } from 'react-router-dom';
import routes from '../../routes'

const  { Header, Content, Footer } = Layout
const App = ( ) => (
    <div>
        <Layout>
            <Header></Header>
            <Content>
                { routes.map( route => (
                    <Route key={ route.path } { ...route } />
                ) ) }
            </Content>
            <Footer></Footer>
        </Layout>
    </div>
)

export default App