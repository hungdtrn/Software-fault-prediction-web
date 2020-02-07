import React from 'react'
import { Card, Row, Col, Button, Typography } from 'antd'
import { Link, useRouteMatch, Switch, Route } from 'react-router-dom'

const { Title } = Typography

const makeCardData = (models, numRows) => {
    let cardRows = [];
    let currentRow = [models[0]];
    for (let i = 1; i < models.length; i++) {
        currentRow.push(models[i])

        if ((i+1) % numRows == 0) {
            cardRows.push(currentRow)
            currentRow = []
        }

    }
    cardRows.push(currentRow)

    return cardRows
}

const FunctionModelList = ({ models }) => {
    const { path , url } = useRouteMatch()
    let num_col = 2
    return (
        <div style={{ background: '#ECECEC', padding: '30px', 'word-wrap': 'normal' }}>
            <Row>
            <Col span={18} offset={3}>
            <Switch>
                <Route exact path={path}>
                    <Row>
                        <Col span={12}><Title>models</Title></Col>
                        <Col span={12} align={"right"}><Button><Link to="/models/create">New</Link></Button></Col>
                    </Row>
                    {
                        (models.length == 0) ? <div>No models found</div> :
                        makeCardData(models, num_col).map((r, id) => {
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


class ModelList extends React.Component {
    constructor(props) {
        super(props)

        this.state = {
            models: []
        }
    }

    componentWillMount() {
        this.props.findAll()
    }

    componentWillReceiveProps(props) {
        this.setState({
            models: props.models
        })
    }

    render() {
        const { models } = this.state
        return <FunctionModelList models={models}/>
        
    }

}

export default ModelList