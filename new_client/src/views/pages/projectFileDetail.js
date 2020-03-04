import React from 'react';
import { connect } from "react-redux";
import { Typography, Row } from 'antd'
import { Switch, Route } from 'react-router-dom'

import { fileActions } from '../../state/duck/file'
import { FileTable, MetricTable } from './components'

class FileDetail extends React.Component {
    constructor(props) {
        super(props)
    }

    componentDidMount() {
        const { match: { params } } = this.props;

        this.props.findByIdRequest(params.fileId, params.projectId)
    }

    clearError() {

    }

    componentDidUpdate(prevProps) {
        console.log(prevProps, this.props)
        const prevParams = prevProps.match.params
        const params = this.props.match.params

        if ((prevParams.fileId != params.fileId) || (prevParams.projectId != params.projectId)) {
            this.props.findByIdRequest(params.fileId, params.projectId)
        }

    }

    render() {
        const { currentFile, loading, error } = this.props
        const { path, url, params } = this.props.match

        const prevPath = url.replace(`/${params.fileId}`, "")
        console.log(prevPath, url, params.fileId)

        if (currentFile) {
            if (currentFile.hasOwnProperty("metrics") && currentFile.metrics.length > 0) {
                return (
                    <Row>
                        <Row align="middle">
                            <h3>{currentFile.name}</h3>
                        </Row>
                        <MetricTable metrics={currentFile.metrics} /> 
                    </Row>
                )
            } else {
                return (
                    <Row>
                        <Row align="middle">
                            <h3>{currentFile.name}</h3>
                        </Row>
                        <FileTable files={[{previous: prevPath}, ...currentFile.childs]} />  
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
    console.log(state.file.find.currentFile)
    return {
        currentFile: state.file.find.currentFile,
        loading: state.file.find.loading,
        error: state.file.find.error
    }
}

const mapDispatchToProps = ( dispatch ) => {
    return {
        findByIdRequest: (id, projectId) => dispatch(fileActions.findByIdRequest(id, projectId)),
        clearError: () => dispatch(fileActions.clearFindError())
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(FileDetail)