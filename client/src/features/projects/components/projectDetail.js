import React from 'react';
import { Typography, Row } from 'antd'
import { Switch, Route } from 'react-router-dom'
import File from '../../files'

const { FileDetail, FileTable } = File.containers


const { Title } = Typography

class Project extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            project: {
                name: "",
                description: "",
                files: []
            }
        }
    }

    componentDidMount() {
        const { match: { params } } = this.props;
        this.props.findById(params.projectId)
    }

    componentWillReceiveProps(props) {
        this.setState({
            loading: props.loading,
            error: props.error,
            project: props.project
        })
    }

    render() {
        const { project } = this.state
        const { path, url } = this.props.match
        return (
            <div>
                <Switch>
                    <Route path={`${path}/:fileId`} key={parseInt(Date.now() / 1000)} component={FileDetail} />
                    <Route exacth path={path}>
                        <Row align="middle">
                            <Title level={3}>{project.name}</Title>
                        </Row>
                        <Row align="middle">{project.description}</Row>
                        <FileTable files={project.files}/>                     
                    </Route>
                </Switch>
            </div>
        )    
    }
}

export default Project