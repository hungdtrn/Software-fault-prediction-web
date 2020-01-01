import React from 'react'
import { Form, Icon, Input, Button, Checkbox } from 'antd'
import  { Loading, ErrorMessage } from '../../utils'
import { Redirect } from 'react-router-dom'
import { getAccessToken } from '../../utils'

class LoginForm extends React.Component {
    constructor(props) {
        super(props)

        this.state = {
            error: null,
            loading: null,
        }
    }

    componentWillReceiveProps = (props) => {
        this.setState({
            error: props.error,
            loading: props.loading
        })
    }

    handleSubmit = (e) => {
        e.preventDefault()
        this.props.form.validateFields((err, values) => {
            if (!err) {
                console.log('Received values of form: ', values)
                this.props.login(values)
            }
        })
    }
    
    clearError = () => {
        this.setState({
            error: null
        })
    }

    render() {
        const { getFieldDecorator } = this.props.form
        let { accessToken } = this.props
        const { loading, error } = this.state
        let showError = (error) ? true : false
        
        if (!accessToken) accessToken = getAccessToken()

        if (!accessToken) {
            return (
                <div>
                    <Loading 
                        visible={loading}
                    />
                    <ErrorMessage 
                        visible={showError}
                        error={error}
                        onCancel={(e) => this.clearError()}
                        onOk={(e) => this.clearError()}
                    />
                    <Form onSubmit={this.handleSubmit} className={"center-form"}>
                        <Form.Item>
                            {getFieldDecorator("username", {
                                rules: [{ required: true, message: 'Please input your username!' }],
                            })(
                                <Input 
                                    prefix={<Icon type="user" style={{ 'color': 'rgba(0, 0, 0, .25)' }} />}
                                    placeholder="Username"
                                />,

                            )}
                        </Form.Item>
                        <Form.Item>
                            {getFieldDecorator("password", {
                                rules: [{ required: true, message: 'Please input your password!' }],
                            })(
                                <Input 
                                    prefix={<Icon type="lock" style={{ color: 'rgba(0, 0, 0, 0.25)' }}/>}
                                    type="password"
                                    placeholder="Password"
                                />
                            )}
                        </Form.Item>
                        <Form.Item>
                            {getFieldDecorator("remember", {
                                valuePropName: 'checked',
                                initialValue: true,
                            })(<Checkbox>Remember me</Checkbox>)}
                            <a style={{ float: "right" }} href="">
                                Forgot password
                            </a>
                            <Button type="primary" htmlType="submit" style={{ "width": "100%" }}>
                                Login
                            </Button>
                            Or <a href="/register">Register now!</a>
                        </Form.Item>
                    </Form>
                </div>
            )
        } else {
            return <Redirect to="/"/>
        }
    }
}

export default Form.create({ name: 'normal_login' })(LoginForm);