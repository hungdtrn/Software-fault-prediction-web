import React from 'react'
import { Form, Input, Button, Upload, Icon } from 'antd'
import  { Loading, ErrorMessage } from '../../utils'

class ModelForm extends React.Component {
    constructor(props) {
        super(props)

        this.state = {
            error: null,
            loading: null,
            file: null
        }
    }

    handleSubmit = (e) => {
        e.preventDefault()
        this.props.form.validateFields((err, values) => {
            if (!err) {
                console.log('Received values of form: ', values)
                this.props.create({
                    ...values,
                    file: this.state.file
                })
            }
        })
    }

    clearError = () => {
        this.setState({
            error: null
        })
    }

    addFile = (file) => {
        console.log(file)
        this.setState({
            file        
        })
        return false
    }

    removeFile = (file) => {
        this.setState({
            file: null
        })
    }

    componentWillReceiveProps = (props) => {
        this.setState({
            error: props.error,
            loading: props.loading
        })
    }
    
    render() {
        const { getFieldDecorator } = this.props.form
        const { loading, error, file } = this.state
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
                    <Form.Item label="Model name">
                        {getFieldDecorator("name", {
                            rules: [{ required: true, message: "Please enter model name"}]
                        })(
                            <Input />
                        )}
                    </Form.Item>
                    <Form.Item label="Description">
                        {getFieldDecorator('description')(<Input />)}
                    </Form.Item>
                    <Form.Item label="File">
                        <Upload name="file" 
                                accept=".pkl"
                                beforeUpload={(e) => this.addFile(e)} 
                                onRemove={() => this.removeFile()}
                                fileList={file?[file]:[]}>
                            <Button>
                                <Icon type="upload" /> Click to upload
                            </Button>
                        </Upload>                    
                    </Form.Item>
                    <Form.Item>
                        <Button htmlType="submit">Create</Button>
                    </Form.Item>
                </Form>
            </div>
        )
    }
}

export default Form.create({ name: 'model_form' })(ModelForm)