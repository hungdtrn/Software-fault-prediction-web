import React from 'react';
import MetricTable from './metricTable'
import FileTable from './fileTable'
import { Row, Col, Typography, Button, Select } from 'antd'
import { Switch, Route, useRouteMatch, useParams } from 'react-router-dom'
import  { Loading, ErrorMessage } from '../../utils'

const { Title } = Typography
const { Option } = Select

class File extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            selectedFile: null,
            selectedModel: null,
            error: null,
            loading: false,
            predicting: false,
        }
    }

    componentDidMount() {
        const { match: { params } } = this.props;
        this.props.findById(params.fileId, params.projectId)
        this.props.findModel()
    }

    componentWillReceiveProps(props) {
        this.setState({
            error: props.error,
            loading: props.loading,
            selectedFile: props.selectedFile,
        })
    }

    togglePredicting() {
        this.setState({
            predicting: !this.state.predicting,
            selectModel: null,
        })
    }

    selectModel(_id) {
        this.setState({
            selectModel: _id
        })
    }

    predict() {
        const { match: { params } } = this.props;

        this.props.predict(params.fileId, this.state.selectModel)
    }

    render() {
        const { selectedFile, models } = this.props

        if (selectedFile.hasOwnProperty("metrics") && selectedFile.metrics.length > 0) {
            return (
                <div>
                    <Row>
                        <Col span={8}>
                            <Title level={2}>{selectedFile.name}</Title>
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
                        <Col span={8}>
                            {
                                this.state.predicting? <Button onClick={() => this.predict()}>Predict</Button>: ""
                            }
                            <Button onClick={(e) => this.togglePredicting()}>{this.state.predicting?"Cancel":"Predict"}</Button>
                        </Col>
                    </Row>
                    <MetricTable    metrics={selectedFile.metrics} 
                                    predicting={this.state.predicting} 
                                    predict={this.predict}/>

                </div>
            )
        } else {
            return (<div>
                <Title level={2}>{selectedFile.name}</Title>
                <FileTable files={selectedFile.childs} />
            </div>)
        }

    }
}

export default File