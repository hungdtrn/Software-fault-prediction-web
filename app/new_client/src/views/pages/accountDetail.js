import React from 'react';
import { connect } from "react-redux";
import { Switch, Route } from 'react-router-dom'
import { Form, Button, Input } from 'antd'

import { FileTable, Spinner, Modal } from './components'
import { userActions } from '../../state/duck/user';

class UserDetail extends React.Component {
    constructor(props) {
        super(props)
    }

    componentDidMount() {
        const { match: { params } } = this.props;
        this.props.findByIdRequest(params.userId)
    }

    clearError = () => {
        if (this.props.findError) this.props.clearFindError()
    }
    

    render() {
        const { loading, currentUser, findError } = this.props
        const { getFieldDecorator } = this.props.form
        
        return (
            <div>
                <Spinner visible={loading} title={ "Finding users" } />
                <Modal 
                    title={ "Something went wrong" }
                    visible={findError != null} 
                    content={findError} 
                    handleOk={this.clearError} 
                    handleCancel={this.clearError} 
                />
                {
                    (currentUser) ? (
                        <Form onSubmit={() => {}} className={"center-form"}>
                            <Form.Item label="User name">
                                <Input value={currentUser.username} disabled={true}/>
                            </Form.Item>
                            <Form.Item label="Email">
                                <Input value={currentUser.email} disabled={true}/>
                            </Form.Item>
                            <Form.Item label="First name">
                                <Input value={currentUser.firstname} disabled={true}/>
                            </Form.Item>
                            <Form.Item label="Last name">
                                <Input value={currentUser.lastname} disabled={true}/>
                            </Form.Item>
                            <Form.Item>
                                <Button>Edit</Button>
                                <Button>Delete</Button>
                            </Form.Item>
                        </Form>            

                    ) : (
                        <div></div>
                    )
                }
            </div>
        )
    }
}

const mapStateToProps = ( state ) => {
    console.log(state.user)
    return {
        loading: state.user.find.loading,
        findError: state.user.find.error,
        currentUser: state.user.find.currentUser,
    }
}

const mapDispatchToProps = ( dispatch ) => ({
    findByIdRequest: ( id ) => dispatch(userActions.findByIdRequest(id)),
    clearFindError: () => dispatch(userActions.clearFindError()),
})

export default connect(mapStateToProps, mapDispatchToProps)(Form.create({ name: 'user_detail_form' })(UserDetail))