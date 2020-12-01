import React from 'react';
import { connect } from "react-redux";
import { Switch, Route } from 'react-router-dom'
import { Form, Button, Input } from 'antd'

import { FileTable, Spinner, Modal } from './components'
import { modelActions } from '../../state/duck/model';

class ModelDetail extends React.Component {
    constructor(props) {
        super(props)
    }

    componentDidMount() {
        const { match: { params } } = this.props;
        this.props.findByIdRequest(params.modelId)
    }

    clearError = () => {
        if (this.props.findError) this.props.clearFindError()
    }
    

    render() {
        const { loading, currentModel, findError } = this.props
        const { getFieldDecorator } = this.props.form
        let file_name = null

        if (currentModel) {
            let flist = currentModel.url.split("_")
            flist.splice(0, 1)
            file_name = flist.join("_")
        }

        return (
            <div>
                <Spinner visible={loading} title={ "Finding models" } />
                <Modal 
                    title={ "Something went wrong" }
                    visible={findError != null} 
                    content={findError} 
                    handleOk={this.clearError} 
                    handleCancel={this.clearError} 
                />
                {
                    (currentModel) ? (
                        <Form onSubmit={() => {}} className={"center-form"}>
                            <Form.Item label="Model name">
                                <Input value={currentModel.name} disabled={true}/>
                            </Form.Item>
                            <Form.Item label="Description">
                                <Input value={currentModel.description} disabled={true}/>
                            </Form.Item>
                            <Form.Item label="FileName">
                                <Input value={file_name} disabled={true}/>
                            </Form.Item>
                            <Form.Item>
                                <Button>Edit</Button>
                                <Button>Delete</Button>
                            </Form.Item>
                        </Form>            

                    ) : (
                        <div></div>
                    )
                }
            </div>
        )
    }
}

const mapStateToProps = ( state ) => {
    console.log(state.model)
    return {
        loading: state.model.find.loading,
        findError: state.model.find.error,
        currentModel: state.model.find.currentModel,
    }
}

const mapDispatchToProps = ( dispatch ) => ({
    findByIdRequest: ( id ) => dispatch(modelActions.findByIdRequest(id)),
    clearFindError: () => dispatch(modelActions.clearFindError()),
})

export default connect(mapStateToProps, mapDispatchToProps)(Form.create({ name: 'model_detail_form' })(ModelDetail))