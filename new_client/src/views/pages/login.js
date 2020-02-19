import React from 'react';
import PropTypes from 'prop-types'
import { connect } from "react-redux";

import { Form, Input, Button, Icon, Checkbox } from 'antd';

import { loginActions } from '../../state/duck/login'
import { Spinner, Modal } from './components'

class LoginForm extends React.Component {
    static propTypes = {
        handleSubmit: PropTypes.func.isRequired,
        clearError: PropTypes.func.isRequired,
        accessToken: PropTypes.string,
        error: PropTypes.string,
        loading: PropTypes.bool,
    }

    handleSubmit = (e) => {
        e.preventDefault()
        this.props.form.validateFields((err, values) => {
            if (!err) {
                this.props.handleSubmit({
                    user: {
                        username: values.username,
                        password: values.password
                    },
                    remember: values.remember
                })
            }
        })
    }

    clearError = () => {
        this.props.clearError()
    }

    render() {
        const { getFieldDecorator } = this.props.form
        const { loading, error, accessToken } = this.props

        return (
            <div>
                <Spinner visible={loading} title={ "Waiting to login" } />
                <Modal 
                    title={ "Login error" }
                    visible={error != null} 
                    content={error || ""} 
                    handleOk={this.clearError} 
                    handleCancel={this.clearError} />
                
                <Modal 
                    title={ "Success" }
                    visible={ accessToken != null }
                    content={ "Success" }
                    handleOk={() => {}}
                    handleCancel={() => {}}
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
    }
}

const mapStateToProps = ( state ) =>  {
    return {
        loading: state.login.loading,
        accessToken: state.login.accessToken,
        error: state.login.error    
    }
} 

const mapDispatchToProps = ( dispatch ) => ( {
    handleSubmit: (values) => dispatch(loginActions.loginRequest(values)),
    clearError: () => dispatch(loginActions.clearError())
} )

export default connect(mapStateToProps, mapDispatchToProps)(Form.create({ name: 'normal_login' })(LoginForm));