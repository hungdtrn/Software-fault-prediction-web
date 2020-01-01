import React from 'react'
import { Form, Input, Button } from 'antd'
import  { Loading, ErrorMessage } from '../../utils'

class ProjectForm extends React.Component {
    constructor(props) {
        super(props)

        this.state = {
            error: null,
            loading: null
        }
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
        this.setState({
            error: null
        })
    }

    componentWillReceiveProps = (props) => {
        this.setState({
            error: props.error,
            loading: props.loading
        })
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
        const { getFieldDecorator } = this.props.form
        const { loading, error } = this.state
        let showError = (error) ? true : false

        return (
            <div>
                <Loading visible={loading}/>
                <ErrorMessage 
                    visible={showError}
                    error={error}
                    onCancel={(e) => this.clearError()}
                    onOk={(e) => this.clearError()}
                />        

                <Form onSubmit={this.handleSubmit} className={"center-form"}>
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
            </div>
        )
    }
}

export default Form.create({ name: 'project_form' })(ProjectForm)