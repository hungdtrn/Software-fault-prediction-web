import React from 'react'
import { Modal, Button } from 'antd';
import PropTypes from 'prop-types'

class CustomModal extends React.Component {
    static propTypes = {
        title: PropTypes.string.isRequired,
        handleOk: PropTypes.func.isRequired,
        handleCancel: PropTypes.func.isRequired,
        content: PropTypes.any.isRequired,
        visible: PropTypes.bool.isRequired
    }

    handleOk = e => {
        this.props.handleOk()
        this.setState({
        visible: false,
        });
    };

    handleCancel = e => {
        this.props.handleCancel()
        this.setState({
        visible: false,
        });
    };

    render() {
        
        return (
        <div>
            <Modal
            title={this.props.title}
            visible={this.props.visible}
            onOk={this.handleOk}
            onCancel={this.handleCancel}
            >
                {this.props.content}
            </Modal>
        </div>
        );
    }
    }

export default CustomModal