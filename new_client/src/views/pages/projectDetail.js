import React from 'react';
import { connect } from "react-redux";
import { Switch, Route } from 'react-router-dom'
import { Typography, Row } from 'antd'

import { FileTable, Spinner, Modal } from './components'
import { projectActions } from '../../state/duck/project';

class ProjectDetail extends React.Component {
    constructor(props) {
        super(props)
    }

    componentDidMount() {
        const { match: { params } } = this.props;
        const { projects } = this.props

        this.props.findByIdRequest(params.projectId)
    }

    clearError = () => {
        this.props.clearError()
    }

    render() {
        const { loading, currentProject, error } = this.props
        return (
            <div>
                <Spinner visible={loading} title={ "Finding projects" } />
                <Modal 
                    title={ "Something went wrong" }
                    visible={error != null} 
                    content={error || ""} 
                    handleOk={this.clearError} 
                    handleCancel={this.clearError} 
                />
                {
                    (currentProject) ? (
                        <Row>
                            <Row align="middle">
                                <h3>{currentProject.name}</h3>
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
    console.log(state.project.find)
    return {
        projects: state.project.find.projects,
        loading: state.project.find.loading,
        error: state.project.find.error,
        currentProject: state.project.find.currentProject
    }
}

const mapDispatchToProps = ( dispatch ) => ({
    findByIdRequest: ( id ) => dispatch(projectActions.findByIdRequest(id)),
    findByIdInArray: ( id ) => {
        dispatch(projectActions.findByIdStart())
        dispatch(projectActions.findByIdInArray(id))
    },
    clearError: () => dispatch(projectActions.clearFindError())
})

export default connect(mapStateToProps, mapDispatchToProps)(ProjectDetail)