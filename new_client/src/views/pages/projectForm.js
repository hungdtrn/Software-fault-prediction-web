import React from 'react'
import { connect } from "react-redux";
import { Route, Switch, Link } from 'react-router-dom';
import { Row, Col, Button, Form, Input } from 'antd'

import { projectActions } from '../../state/duck/project'
import { Spinner, Modal } from './components'

class ProjectForm extends React.Component {
    constructor(props) {
        super(props)
    }

    handleSubmit = (e) => {
        e.preventDefault()
        this.props.form.validateFields((err, values) => {
            if (!err) {
                console.log('Received values of form: ', values)
                this.props.create(values)
            }
        })
    }

    clearError = () => {
        this.props.clearError()
    }

    handleSuccess = () => {
        this.props.history.push("/projects")
    }

    validateGithubLink = (rule, value, callback) => {
        let re = new RegExp("^https\:\/\/github\.com\/[^\/]+\/[^\/]+\.git$")
        if (!re.test(value)) {
            callback('Github link should ends with ".git"')
        } else {
            callback()
        }
    }

    render() {
        const { loading, createdProject, error } = this.props
        const { getFieldDecorator } = this.props.form

        return (<div>
            <Spinner visible={loading} title={ "Creating projects" } />
            <Modal 
                title={ "Create error" }
                visible={error != null} 
                content={error || ""} 
                handleOk={this.clearError} 
                handleCancel={this.clearError} 
            />

            <Modal 
                title={ "Success !" }
                visible={createdProject != null} 
                content={"Project created"} 
                handleOk={this.handleSuccess} 
                handleCancel={this.handleSuccess} 
            />

            <Form onSubmit={this.handleSubmit} className="center-form">
                <Form.Item label="Project name">
                    {getFieldDecorator("name", {
                        rules: [{ required: true, message: "Please enter project name"}]
                    })(
                        <Input />
                    )}
                    </Form.Item>
                    <Form.Item label="Description">
                        {getFieldDecorator('description')(<Input />)}
                    </Form.Item>
                    <Form.Item label="Github link">
                        {getFieldDecorator("github", {
                            rules: [
                                {
                                    required: true,
                                    message: "Please input the project's github link"
                                }, {
                                    validator: this.validateGithubLink
                                }
                            ]
                        })(
                            <Input 
                                placeholder="E.g https://github.com/username/projectname.git"
                            />
                        )}
                    </Form.Item>
                    <Form.Item>
                        <Button htmlType="submit">Create</Button>
                    </Form.Item>

            </Form>

            
        </div>)
    }
}

const mapStateToProps = ( state ) => {
    return {
        loading: state.project.create.loading,
        createdProject: state.project.create.createdProject,
        error: state.project.create.error    
    }
}

const mapDispatchToProps = ( dispatch ) => ({
    create: (project) => dispatch(projectActions.createRequest(project)),
    clearError: () => dispatch(projectActions.clearCreateError())
})

export default connect(mapStateToProps, mapDispatchToProps)(Form.create({ name: 'project_form' })(ProjectForm))