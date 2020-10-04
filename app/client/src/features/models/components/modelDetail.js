import React from 'react';
import { Typography, Row } from 'antd'



const { Title } = Typography

class Model extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            model: {
                name: "",
                description: "",
                files: []
            }
        }
    }

    componentDidMount() {
        const { match: { params } } = this.props;
        this.props.findById(params.modelId)
    }

    componentWillReceiveProps(props) {
        this.setState({
            loading: props.loading,
            error: props.error,
            model: props.model
        })
    }

    render() {
        const { model } = this.state
        return (
            <div>
                        <Row align="middle">
                            <Title level={3}>{model.name}</Title>
                        </Row>
                        <Row align="middle">{model.description}</Row>
            </div>
        )    
    }
}

export default Model