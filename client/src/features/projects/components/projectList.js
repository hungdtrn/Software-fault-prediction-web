import React from 'react'
import { Card, Row, Col, Button, Typography } from 'antd'
import { Link, useRouteMatch, Switch, Route } from 'react-router-dom'

const { Title } = Typography

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

const FunctionProjectList = ({ projects }) => {
    const { path , url } = useRouteMatch()
    let num_col = 2
    return (
        <div style={{ background: '#ECECEC', padding: '30px', 'word-wrap': 'normal' }}>
            <Row>
            <Col span={18} offset={3}>
            <Switch>
                <Route exact path={path}>
                    <Row>
                        <Col span={12}><Title>Projects</Title></Col>
                        <Col span={12} align={"right"}><Button><Link to="/projects/create">New</Link></Button></Col>
                    </Row>
                    {
                        (projects.length == 0) ? <div>No projects found</div> :
                        makeCardData(projects, num_col).map((r, id) => {
                            return (
                                <div>
                                    <Row gutter={16}>
                                        {
                                            r.map((c) => {
                                                return (
                                                    <Col key={c._id} span={12}>
                                                        <Link to={`${url}/${c._id}`}>
                                                            <Card hoverable title={c.name} bordered={false}>
                                                                <p className="truncate">
                                                                    {c.description}
                                                                </p>
                                                                <p>
                                                                    {c.github}
                                                                </p>
                                                            </Card>
                                                        </Link>
                                                    </Col>
                                                )
                                            })
                                        }
                                    </Row>
                                </div>
                            )    
                        })
                    }
                </Route>
            </Switch>
            </Col></Row>
        </div>
    )
}


class ProjectList extends React.Component {
    constructor(props) {
        super(props)

        this.state = {
            projects: []
        }
    }

    componentWillMount() {
        this.props.findAll()
    }

    componentWillReceiveProps(props) {
        this.setState({
            projects: props.projects
        })
    }

    render() {
        const { projects } = this.state
        return <FunctionProjectList projects={projects}/>
        
    }

}

export default ProjectList