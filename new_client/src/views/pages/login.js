import React from 'react';
import { Form, Input, Button, Icon, Checkbox } from 'antd';

class LoginForm extends React.Component {
    render() {
        const { getFieldDecorator } = this.props.form

        return (
            <div>
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

export default Form.create({ name: 'normal_login' })(LoginForm);