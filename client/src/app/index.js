import React from 'react'
import { Layout, Row, Col, Button } from 'antd'

import { BrowserRouter, Route, Switch, Redirect } from 'react-router-dom'
import Auth from '../features/auth'
import Project from '../features/projects'
import Model from '../features/models'

import Home from '../features/home'
import { clearAccessToken, getAccessToken } from '../features/utils'

const  { Header, Content, Footer } = Layout
const { LoginForm, RegisterForm } = Auth.containers
const { ProjectList, ProjectForm, ProjectDetail } = Project.containers
const { ModelList, ModelForm, ModelDetail } = Model.containers

class App extends React.Component {
    constructor(props) {
        super(props)

        this.logout = this.logout.bind(this)
    }
    logout() {
        clearAccessToken()
    }
    render() {
        const accessToken = getAccessToken()
        return (
            <BrowserRouter>
                <div>
                    <Layout style={{height:"100vh"}}>
                        <Header>
                            <Col span={12} offset={12} align={"right"}><Button onClick={() => this.logout()}>Logout</Button></Col>
                        </Header>
                        <Content>
                            <Switch>
                                <Route path="/login">
                                    <div style={{ "margin-top": "60px" }}>
                                        <LoginForm />
                                    </div>
                                </Route>
                                <Route path="/register">
                                    <div style={{ "margin-top": "60px" }}>
                                        <RegisterForm />
                                    </div>
                                </Route>
                            </Switch>
                            {
                            (accessToken) ? (
                                <Switch>
                                    <Route exact path="/projects">
                                        <ProjectList />
                                    </Route>
                                    <Route path="/projects/create">
                                        <div style={{ "margin-top": "60px" }}>
                                            <ProjectForm />
                                        </div>
                                    </Route>
                                    <Route path="/projects/:projectId" component={ProjectDetail}/>
                                    <Route exact path="/models">
                                        <ModelList />
                                    </Route>
                                    <Route path="/models/create">
                                        <div style={{ "margin-top": "60px" }}>
                                            <ModelForm />
                                        </div>
                                    </Route>
                                    <Route path="/models/:modelId" component={ModelDetail}/>
                                    <Route path="/home" component={Home}/>
                                    <Route exact path="/" component={Home}/>
                                </Switch>
                            ) :
                            ( <Redirect to="/login"/>)

                            }
                        </Content>
                        <Footer></Footer>
                    </Layout>
                </div>
            </BrowserRouter>
        )
    }
}

export default App