import React from 'react'
import { connect } from "react-redux";
import { Route, Switch, Link } from 'react-router-dom';
import { Row, Col, Button, Card, Typography } from 'antd'

import { userActions } from '../../state/duck/user'
import { Spinner, Modal } from './components'
import { userManagementRoutes } from '../../routes/'

const { Title } = Typography
class AllUserPage extends React.Component {
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
        const { loading, users, error } = this.props
        console.log(users)
        return (
            <div style={{ background: '#ECECEC', padding: '30px', 'wordWrap': 'normal'}}>
                <Switch>
                    {
                        userManagementRoutes.map(route => (
                            <Route key={ route.path } { ...route } />
                        ))
                    }
                    <Route exact path="/users">
                        <Spinner visible={loading} title={ "Finding useres" } />
                        <Modal 
                            title={ "Find error" }
                            visible={error != null} 
                            content={error || ""} 
                            handleOk={this.clearError} 
                            handleCancel={this.clearError} 
                        />
                        <Row>                        
                            <Col span={12}><h2>Users</h2></Col>
                            <Col span={12} align={"right"}><Button><Link to="/useres/create">New</Link></Button></Col>
                        </Row>
                        <Row>
                            {
                                    (users.length == 0) ? <div>No users found</div> :
                                    makeCardData(users, 2).map((r, id) => {
                                        return (
                                            <Row  key={id} gutter={16} style={{"marginBottom": "10px"}}>
                                                {
                                                    r.map((c) => {
                                                        return (
                                                            <Col key={c._id} span={12}>
                                                                {
                                                                    <Link to={`/users/${c._id}`}>
                                                                            <Card hoverable title={c.username} bordered={false}>
                                                                                <p className="truncate">
                                                                                    <b>Email:</b> {c.email}
                                                                                </p>
                                                                                <p>
                                                                                    <b>First name:</b> {c.firstname}
                                                                                </p>
                                                                                <p>
                                                                                    <b>Last name:</b> {c.lastname}
                                                                                </p>
                                                                            </Card>
                                                                    </Link>
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
        loading: state.user.find.loading,
        users: state.user.find.users,
        error: state.user.find.error
    }
}

const mapDispatchToProps = ( dispatch ) => ( {
    findAll: () => dispatch(userActions.findAllRequest()),
    clearError: () => dispatch(userActions.clearFindError())
} )

const makeCardData = (users, numRows) => {
    let cardRows = [];
    let currentRow = [users[0]];
    for (let i = 1; i < users.length; i++) {
        currentRow.push(users[i])

        if ((i+1) % numRows == 0) {
            cardRows.push(currentRow)
            currentRow = []
        }

    }
    cardRows.push(currentRow)

    return cardRows
}

export default connect(mapStateToProps, mapDispatchToProps)(AllUserPage)
