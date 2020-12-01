import React from 'react'
import { connect } from "react-redux";
import { Form, Input, Button, Upload, Icon } from 'antd'

import { Spinner, Modal } from './components'
import { modelActions } from '../../state/duck/model'

class ModelForm extends React.Component {
    constructor(props) {
        super(props)

        this.state = {
            file: null,
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
        this.props.clearCreate()
    }

    handleSuccess = () => {
        this.props.clearCreate()
        this.props.history.push("/models")
    }

    addFile = ( file ) => {
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

    render() {
        const { getFieldDecorator } = this.props.form
        const { loading, error, createdModel } = this.props
        const { file } = this.state

        return (
            <div>
                <Spinner visible={loading} title={ "Creating models" } />
                <Modal 
                    title={ "Create error" }
                    visible={error != null} 
                    content={error || ""} 
                    handleOk={this.clearError} 
                    handleCancel={this.clearError} 
                />
                <Modal 
                    title={ "Success !" }
                    visible={createdModel != null} 
                    content={"Model created"} 
                    handleOk={this.handleSuccess} 
                    handleCancel={this.handleSuccess} 
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

const mapStateToProps = ( state ) => {
    return {
        loading: state.model.create.loading,
        createdModel: state.model.create.createdModel,
        error: state.model.create.error
    }
}

const mapDispatchToProps = ( dispatch ) => {
    return {
        create: ( model ) => dispatch(modelActions.createRequest(model)),
        clearCreate: () => dispatch(modelActions.clearCreate())
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(Form.create({ name: 'model_form' })(ModelForm))