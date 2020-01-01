import React from 'react'
import {
    Form,
    Input,
    Button,
} from 'antd';
import { Link } from 'react-router-dom'
  
class RegisterForm extends React.Component {
    handleSubmit = e => {
        e.preventDefault();
        this.props.form.validateFieldsAndScroll((err, values) => {
          if (!err) {
            console.log('Received values of form: ', values);
            this.props.register(values)
          }
        });
    };

    compareToFirstPassword = (rule, value, callback) => {
        const { form } = this.props;
        if (value && value !== form.getFieldValue('password')) {
          callback('Two passwords that you enter is inconsistent!');
        } else {
          callback();
        }
    };

    render() {
        const { getFieldDecorator } = this.props.form;

        const formItemLayout = {
            labelCol: {
              xs: { span: 24 },
              sm: { span: 24 },
            },
            wrapperCol: {
              xs: { span: 24 },
              sm: { span: 24 },
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
                offset: 4,
              },
            },
          };

        return (
            <div>
                <Form onSubmit={this.handleSubmit} className={"center-form"}>
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
                    <Form.Item>
                        <Button type="primary" htmlType="submit" block>
                            Register
                        </Button>
                        <Button type="primary" block>
                            <Link to="/login">Login</Link>
                        </Button>
                    </Form.Item>
                </Form>
            </div>
        )
    }
}

export default Form.create({ name: 'register' })(RegisterForm);