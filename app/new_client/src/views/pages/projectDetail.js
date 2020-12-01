import React from 'react';
import { connect } from "react-redux";
import { Switch, Route } from 'react-router-dom'
import { Typography, Row, Col, Button } from 'antd'

import { FileTable, Spinner, Modal } from './components'
import { projectActions } from '../../state/duck/project';

class ProjectDetail extends React.Component {
    constructor(props) {
        super(props)

        this.state = {
            deleting: false
        }
    }

    componentDidMount() {
        const { match: { params } } = this.props;
        const { projects } = this.props

        this.props.findByIdRequest(params.projectId)
    }

    startDelete = () => {
        this.setState({
            deleting: true
        })
    }

    stopDelete = () => {
        this.setState({
            deleting: false
        })
    }

    clearError = () => {
        if (this.props.deleteError) {
            this.props.clearDelete()
            this.stopDelete()
        }
        if (this.props.findError) this.props.clearFindError()
    }

    handleSuccess = () => {
        this.props.clearDelete()
        this.props.history.push("/projects")
    }


    delete = () => {
        const { match: { params } } = this.props;
        this.props.deleteById(params.projectId)
    }

    render() {
        const { loading, currentProject, findError, deleteError, deleteSuccess } = this.props
        return (
            <div>
                <Spinner visible={loading} title={ "Finding projects" } />
                <Modal 
                    title={ "Something went wrong" }
                    visible={findError != null || deleteError != null} 
                    content={findError || deleteError || ""} 
                    handleOk={this.clearError} 
                    handleCancel={this.clearError} 
                />
                {
                    (currentProject) ? (
                        <Row>
                            <Modal 
                                title={ "Are you sure?"}
                                visible={this.state.deleting} 
                                content={"This will completely delete your project"} 
                                handleOk={this.delete} 
                                handleCancel={this.stopDelete} 
                            />
                            <Modal 
                                title={ "Delete Success"}
                                visible={deleteSuccess} 
                                content={""} 
                                handleOk={() => this.handleSuccess()} 
                                handleCancel={() => this.handleSuccess()} 
                            />

                            <Row align="middle">
                                <Col span={12}>
                                    <h3>{currentProject.name}</h3>
                                </Col>
                                <Col span={12} align="right">
                                    <Button onClick={() => this.startDelete()}>Delete</Button>
                                </Col>
                            </Row>
                            <Row align="middle">{currentProject.description}</Row>
                            <FileTable files={[{previous: "/projects"}, ...currentProject.files]}/>      
                        </Row>
                    ) : (
                        <div></div>
                    )
                }
            </div>
        )
    }
}

const mapStateToProps = ( state ) => {
    console.log(state.project)
    return {
        projects: state.project.find.projects,
        loading: state.project.find.loading,
        findError: state.project.find.error,
        currentProject: state.project.find.currentProject,
        deleteError: state.project.delete.error,
        deleteSuccess: state.project.delete.success,
    }
}

const mapDispatchToProps = ( dispatch ) => ({
    findByIdRequest: ( id ) => dispatch(projectActions.findByIdRequest(id)),
    findByIdInArray: ( id ) => {
        dispatch(projectActions.findByIdStart())
        dispatch(projectActions.findByIdInArray(id))
    },
    deleteById: ( id ) => dispatch(projectActions.deleteRequest(id)),
    clearFindError: () => dispatch(projectActions.clearFindError()),
    clearDelete: () => dispatch(projectActions.clearDelete()),
})

export default connect(mapStateToProps, mapDispatchToProps)(ProjectDetail)