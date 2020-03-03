import React from 'react'
import { connect } from "react-redux";
import { Route, Switch, Link } from 'react-router-dom';
import { Row, Col, Button, Card, Typography } from 'antd'

import { projectActions } from '../../state/duck/project'
import { Spinner, Modal } from './components'
import { projectRoutes } from '../../routes/'

const { Title } = Typography
class ProjectPage extends React.Component {
    constructor(props) {
        super(props)
    }

    componentDidMount(props) {
        this.props.findAll()
    }
    
    clearError = () => {
        this.props.clearError()
    }

    render() {
        const { loading, projects, error } = this.props

        return (
            <div style={{ background: '#ECECEC', padding: '30px', 'wordWrap': 'normal'}}>
                <Switch>
                    {
                        projectRoutes.map(route => (
                            <Route key={ route.path } { ...route } />
                        ))
                    }
                    <Route exact path="/projects">
                        <Spinner visible={loading} title={ "Finding projects" } />
                        <Modal 
                            title={ "Find error" }
                            visible={error != null} 
                            content={error || ""} 
                            handleOk={this.clearError} 
                            handleCancel={this.clearError} 
                        />
                        <Row>                        
                            <Col span={12}><h2>Projects</h2></Col>
                            <Col span={12} align={"right"}><Button><Link to="/projects/create">New</Link></Button></Col>
                        </Row>
                        <Row>
                            {
                                    (projects.length == 0) ? <div>No projects found</div> :
                                    makeCardData(projects, 2).map((r, id) => {
                                        return (
                                            <Row  key={id} gutter={16} style={{"marginBottom": "10px"}}>
                                                {
                                                    r.map((c) => {
                                                        return (
                                                            <Col key={c._id} span={12}>
                                                                {
                                                                    (c.status == "done") ? (
                                                                        <Link to={`/projects/${c._id}`}>
                                                                            <Card hoverable title={c.name} bordered={false}>
                                                                                <p className="truncate">
                                                                                    {c.description}
                                                                                </p>
                                                                                <p>
                                                                                    {c.github}
                                                                                </p>
                                                                            </Card>
                                                                        </Link>
                                                                    ) : <Card hoverable title={`${c.name} (updating)`} bordered={false} loading={true}>
                                                                            <p className="truncate">
                                                                                {c.description}
                                                                            </p>
                                                                            <p>
                                                                                {c.github}
                                                                            </p>
                                                                        </Card>
                                                                }
                                                            </Col>
                                                        )
                                                    })
                                                }
                                            </Row>
                                        )
                                    })
                            }
                        </Row>
                    </Route>
                </Switch>

            </div>
        )
    }
}

const mapStateToProps = ( state, ownProps ) => {
    return {
        loading: state.project.find.loading,
        projects: state.project.find.projects,
        error: state.project.find.error
    }
}

const mapDispatchToProps = ( dispatch ) => ( {
    findAll: () => dispatch(projectActions.findAllRequest()),
    clearError: () => dispatch(projectActions.clearFindError())
} )

const makeCardData = (projects, numRows) => {
    let cardRows = [];
    let currentRow = [projects[0]];
    for (let i = 1; i < projects.length; i++) {
        currentRow.push(projects[i])

        if ((i+1) % numRows == 0) {
            cardRows.push(currentRow)
            currentRow = []
        }

    }
    cardRows.push(currentRow)

    return cardRows
}

export default connect(mapStateToProps, mapDispatchToProps)(ProjectPage)
