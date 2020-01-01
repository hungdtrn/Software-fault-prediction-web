import React from 'react'
import { Layout, Row } from 'antd'

import { BrowserRouter, Route, Switch } from 'react-router-dom'
import Auth from '../features/auth'
import Project from '../features/projects'
import Model from '../features/models'

import Home from '../features/home'


const  { Header, Content, Footer } = Layout
const { LoginForm, RegisterForm } = Auth.containers
const { ProjectList, ProjectForm, ProjectDetail } = Project.containers
const { ModelList, ModelForm, ModelDetail } = Model.containers

class App extends React.Component {
    render() {
        return (
            <BrowserRouter>
                <div>
                    <Layout style={{height:"100vh"}}>
                        <Header></Header>
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
                        </Content>
                        <Footer></Footer>
                    </Layout>
                </div>
            </BrowserRouter>
        )
    }
}

export default App