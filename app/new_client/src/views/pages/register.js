import React from 'react';
import PropTypes from 'prop-types'
import { connect } from "react-redux";
import { Row, Col, Form, Input, Button, Icon, Checkbox,  } from 'antd';
import { Link } from 'react-router-dom'
import { Redirect } from 'react-router-dom';

import { registerActions } from '../../state/duck/register'
import { Spinner, Modal } from './components'

class RegisterForm extends React.Component {
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
                    username: values.username,
                    email: values.email,
                    firstname: values.firstname,
                    lastname: values.lastname,
                    password: values.password
            })
            }
        })
    }

    clearError = () => {
        this.props.clearError()
    }

    render() {
        const { getFieldDecorator } = this.props.form
        const { loading, error, success } = this.props
        const formItemLayout = {
            labelCol: {
              xs: { span: 24 },
              sm: { span: 8 },
            },
            wrapperCol: {
              xs: { span: 24 },
              sm: { span: 16 },
            },
          };

        const tailFormItemLayout = {
            wrapperCol: {
              xs: {
                span: 24,
                offset: 0,
              },
              sm: {
                span: 16,
                offset: 8,
              },
            },
          };
      

        return (
            <Row type="flex" justify="center" align="middle" className="container">
                <Col span={12}>
                    <Spinner visible={loading} title={ "Waiting to register" } />
                    <Modal 
                            title={ "Register error" }
                            visible={error != null} 
                            content={error || ""} 
                            handleOk={this.clearError} 
                            handleCancel={this.clearError} />
                        
                    <Modal 
                            title={ "Success" }
                            visible={ success }
                            content={ "Success" }
                            handleOk={() => {
                                this.props.history.push("/login")
                            }}
                            handleCancel={() => {
                                this.props.history.push("/login")
                            }}
                    />

                    <Form {...formItemLayout} onSubmit={this.handleSubmit} className={"center-form"}>
                        <Form.Item label="E-mail">
                            {getFieldDecorator('email', {
                                rules: [
                                    {
                                        type: 'email',
                                        message: 'The input is not valid E-mail',
                                    },
                                    {
                                        required: true,
                                        message: 'Please input your E-mail!',
                                    },
                                ],
                            })(<Input />)}
                        </Form.Item>
                        <Form.Item label="Username">
                            {getFieldDecorator('username', {
                                rules: [
                                    {
                                        required: true,
                                        message: 'Please input your username'
                                    }
                                ]
                            })(<Input />)}
                        </Form.Item>
                        <Form.Item label="First name">
                            {getFieldDecorator('firstname', {
                                rules: [
                                    {
                                        required: true,
                                        message: 'Please input your first name'
                                    }
                                ]
                            })(<Input />)}
                        </Form.Item>
                        <Form.Item label="Last name">
                            {getFieldDecorator('lastname', {
                                rules: [
                                    {
                                        required: true,
                                        message: 'Please input your last name'
                                    }
                                ]
                            })(<Input />)}
                        </Form.Item>
                        <Form.Item label="Password" hasFeedback>
                            {getFieldDecorator('password', {
                                rules: [
                                    {
                                        required: true,
                                        message: 'Please input your password!'
                                    },
                                ]
                            })(<Input.Password />)}
                        </Form.Item>
                        <Form.Item label="Confirm Password" hasFeedback>
                            {getFieldDecorator('confirm', {
                                rules: [
                                    {
                                        required: true,
                                        message: 'Please confirm your password'
                                    }, {
                                        validator: this.compareToFirstPassword
                                    }
                                ]
                            })(<Input.Password />)}
                        </Form.Item>
                        <Form.Item {...tailFormItemLayout}>
                            <Row gutter={8}>
                                <Col span={6}>
                                    <Button type="primary" htmlType="submit">
                                        Register
                                    </Button>

                                </Col>
                                <Col span={6}>
                                    <Button type="primary">
                                        <Link to="/login">Login</Link>
                                    </Button>
                                </Col>
                            </Row>
                        </Form.Item>
                    </Form>                
                </Col>
            </Row>   
        )
    }
}

const mapStateToProps = ( state ) =>  {
    return {
        loading: state.register.loading,
        success: state.register.success,
        error: state.register.error    
    }
} 

const mapDispatchToProps = ( dispatch ) => ( {
    handleSubmit: (values) => dispatch(registerActions.registerRequest(values)),
    clearError: () => dispatch(registerActions.clearError())
} )

export default connect(mapStateToProps, mapDispatchToProps)(Form.create({ name: 'normal_register' })(RegisterForm));