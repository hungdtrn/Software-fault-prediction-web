import React from 'react'
import { connect } from "react-redux";

import { projectActions } from '../../state/duck/project'
import { Spinner, Modal } from './components'

class ProjectPage extends React.Component {
    constructor(props) {
        super(props)

        this.state = {
            loading: false,
            projects: [],
            error: null
        }
    }

    componentDidMount(props) {
        this.props.findAll()
    }
    
    componentDidUpdate(prevProps, prevState, snapshot) {
        this.setState({
            loading: this.props.loading,
            projects: this.props.projects,
            error: this.props.error
        })
    }

    render() {
        return (
            <div>Project page</div>
        )
    }
}

const mapStateToProps = ( state ) => {
    return {
        loading: state.projectFind.loading,
        projects: state.projectFind.projects,
        error: state.projectFind.error
    }
}

const mapDispatchToProps = ( dispatch ) => ( {
    findAll: () => dispatch(projectActions.findAllRequest()),
    clearError: () => dispatch(projectActions.clearFindError())
} )

export default connect(mapStateToProps, mapDispatchToProps)(ProjectPage)
