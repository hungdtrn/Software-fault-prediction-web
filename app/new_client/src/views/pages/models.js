import React from 'react'
import { connect } from "react-redux";
import { Card, Row, Col, Button } from 'antd'
import { Link, useRouteMatch, Switch, Route } from 'react-router-dom'

import { modelActions } from '../../state/duck/model'
import { Spinner, Modal } from './components'
import { modelRoutes } from '../../routes'

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

class ModeList extends React.Component {
    constructor(props) {
        super(props)
    }

    componentDidMount() {
        this.props.findAll()
    }

    clearError = () => {
        this.props.clearError()
    }

    render() {
        const { loading, models, error } = this.props
        const num_col = 2

        return (
            <div style={{ background: '#ECECEC', padding: '30px', 'wordWrap': 'normal' }}>
                <Switch>
                    {
                        modelRoutes.map(route => (
                            <Route key={ route.path } { ...route }/>
                        ))                    
                    }

                        <Route exact path="/models">
                            <Spinner visible={loading} title={ "Finding models" } />
                            <Modal 
                                title={ "Find error" }
                                visible={error != null} 
                                content={error || ""} 
                                handleOk={this.clearError} 
                                handleCancel={this.clearError} 
                            />
                            <Row>
                                <Col span={12}><h3>models</h3></Col>
                                <Col span={12} align={"right"}><Button><Link to="/models/create">New</Link></Button></Col>
                            </Row>
                            <Row>
                                {
                                    (models.length == 0) ? <div>No models found</div> :
                                    makeCardData(models, num_col).map((r, id) => {
                                        return (
                                            <Row gutter={16} style={{"marginBottom": "10px"}}>
                                                {
                                                    r.map((c) => {
                                                        return (
                                                            <Col key={c._id} span={12}>
                                                                <Link to={`/models/${c._id}`}>
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
        loading: state.model.find.loading,
        models: state.model.find.models,
        error: state.model.find.error
    }
}

const mapDispatchToProps = ( dispatch ) => {
    return {
        findAll: () => dispatch(modelActions.findAllRequest()),
        clearError: () => dispatch(modelActions.clearFindError())
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(ModeList)