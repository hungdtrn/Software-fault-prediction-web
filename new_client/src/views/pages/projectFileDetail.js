import React from 'react';
import { connect } from "react-redux";
import { Typography, Row, Col, Button, Select } from 'antd'
import { Switch, Route } from 'react-router-dom'

import { fileActions } from '../../state/duck/file'
import { modelActions } from '../../state/duck/model'
import { FileTable, MetricTable, Spinner, Modal } from './components'

const { Option } = Select
class FileDetail extends React.Component {
    constructor(props) {
        super(props)

        this.state = {
            predicting: false,
            modelId: null,
        }
    }

    componentDidMount() {
        const { match: { params } } = this.props;

        this.props.findByIdRequest(params.fileId, params.projectId)
    }

    clearFileError = () => {
        this.props.clearFindByIdError()
    }

    clearModelError = () => {
        this.props.clearFindModelError()
    }

    clearPredict = () => {
        this.props.clearPredict()
    }

    predict = () => {
        const { match: { params } } = this.props;
        
        this.props.predictByIdRequest(params.fileId, this.state.modelId)
    }

    togglePredicting = () => {
        this.setState({
            predicting: !this.state.predicting
        }, () => {
            if ((this.state.predicting) && (this.props.models.length == 0)) {
                this.props.findModelRequest()
            }    
        })

    }

    selectModel = (modelId) => {
        this.setState({
            ...this.state,
            modelId
        })
    }

    componentDidUpdate(prevProps) {
        const prevParams = prevProps.match.params
        const params = this.props.match.params
        
        if ((prevParams.fileId != params.fileId) || (prevParams.projectId != params.projectId)) {
            this.props.findByIdRequest(params.fileId, params.projectId)
        }

        console.log(this.props)
    }

    render() {
        let { currentFile, fileLoading, fileError, 
                modelError, models, modelLoading,
                predictLoading, predictError, updatedFile } = this.props
        
        const { path, url, params } = this.props.match

        const prevPath = url.replace(`/${params.fileId}`, "")

        if (currentFile) {
            if (currentFile.hasOwnProperty("metrics") && currentFile.metrics.length > 0) {
                return (
                    <Row>
                        <Spinner visible={fileLoading || modelLoading || predictLoading} title={ "Loading" } />
                        <Modal 
                            title={ "Some thing went wrong" }
                            visible={fileError != null} 
                            content={fileError || ""} 
                            handleOk={this.clearFileError} 
                            handleCancel={this.clearFileError} />

                        <Modal 
                            title={ "Some thing went wrong" }
                            visible={modelError != null} 
                            content={modelError || ""} 
                            handleOk={this.clearModelError} 
                            handleCancel={this.clearModelError} />

                        <Modal 
                            title={ "Some thing went wrong" }
                            visible={predictError != null} 
                            content={predictError || ""} 
                            handleOk={this.clearPredict} 
                            handleCancel={this.clearPredict} />

                        <Modal 
                            title={ "Predict success" }
                            visible={updatedFile != null} 
                            content={""} 
                            handleOk={() => {this.props.clearPredict(); this.props.history.goBack();}} 
                            handleCancel={() => {this.props.clearPredict(); this.props.history.goBack()}} />


                        <Row align="middle">
                            <Col span={8}>
                                <h3>{currentFile.name}</h3>
                            </Col>
                            <Col span={8}>
                                {
                                    this.state.predicting? <Select 
                                                                onChange={(value) => this.selectModel(value)} 
                                                                style={{"minWidth": "300px"}}>
                                        {
                                            models.map((m) => {
                                                return (<Option key={m._id} value={m._id}>{m.name}</Option>)
                                            })
                                        }
                                    </Select> : ""
                                }
                            </Col>
                            <Col span={8} align="right">
                                {
                                    this.state.predicting? <Button style={{"marginRight": "10px"}} onClick={() => this.predict()}>Predict</Button>: ""
                                }
                                <Button onClick={(e) => this.togglePredicting()}>{this.state.predicting?"Cancel":"Predict"}</Button>
                            </Col>

                        </Row>
                        <MetricTable metrics={currentFile.metrics} /> 
                    </Row>
                )    
            } else if (currentFile.childs && currentFile.childs.length > 0) {
                return (
                    <Row>
                        <Spinner visible={fileLoading} title={ "Loading" } />
                        <Modal 
                            title={ "Some thing went wrong" }
                            visible={fileError != null} 
                            content={fileError || ""} 
                            handleOk={this.clearFileError} 
                            handleCancel={this.clearFileError} />

                        <Row align="middle">
                            <h3>{currentFile.name}</h3>
                        </Row>
                        <FileTable files={[{previous: prevPath}, ...currentFile.childs]} />  
                    </Row>
                )

            } else {
                return (
                    <Row align="middle">
                        <h3>{currentFile.name}</h3>
                    </Row>
                )
            }
        } else {
            return (
                <div></div>
            )
        }
    }
}

const mapStateToProps = ( state ) => {
    return {
        currentFile: state.file.find.currentFile,
        models: state.model.find.models,
        fileLoading: state.file.find.loading,
        modelLoading: state.model.find.loading,
        fileError: state.file.find.error,
        modelError: state.model.find.error,
        predictLoading: state.file.predict.loading,
        updatedFile: state.file.predict.updatedFile,
        predictError: state.file.predict.error,
    }
}

const mapDispatchToProps = ( dispatch ) => {
    return {
        findByIdRequest: (id, projectId) => dispatch(fileActions.findByIdRequest(id, projectId)),
        findModelRequest: () => dispatch(modelActions.findAllRequest()),
        clearFindByIdError: () => dispatch(fileActions.clearFindError()),
        clearFindModelError: () => dispatch(modelActions.clearFindError()),
        predictByIdRequest: (id, modelId) => dispatch(fileActions.predictByIdRequest(id, modelId)),
        clearPredict: () => dispatch(fileActions.clearPredict())
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(FileDetail)