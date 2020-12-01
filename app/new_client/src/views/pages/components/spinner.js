import React from 'react'
import { Modal, Button } from 'antd';
import PropTypes from 'prop-types'
import { Spin, Icon } from 'antd'

const antIcon = <Icon type="loading" style={{ fontSize: 24 }} spin />;

class CustomSpinner extends React.Component {
    static propTypes = {
        title: PropTypes.string.isRequired,
        visible: PropTypes.bool.isRequired
    }

    render() {
        
        return (
        <div>
            <Modal
            title={this.props.title}
            visible={this.props.visible}
            closable={false}
            maskClosable={false}
            okButtonProps={{ disabled: true }}
            cancelButtonProps={{ disabled: true }}  
            >
                <Spin indicator={antIcon} />
            </Modal>
        </div>
        );
    }
}

export default CustomSpinner

