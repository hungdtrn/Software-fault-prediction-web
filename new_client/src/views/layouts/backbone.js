import React from 'react'
import PropTypes from 'prop-types'
import { Layout, Menu, Icon } from 'antd'
import { withRouter, Link } from 'react-router-dom';

const { Header, Sider, Content } = Layout;

class BackboneLayout extends React.Component {
    static propTypes = {
        siders: PropTypes.array.isRequired,
        content: PropTypes.any,
        header: PropTypes.any
    }

    state = {
        collapsed: true
    }

    toggle = () => {
        this.setState({
            collapsed: !this.state.collapsed
        })
    }

    render() {
        const {pathname} = this.props.location;
        const defaultKeys = this.props.siders.filter((i) => i.path == pathname).map(i => i.key)

        return (
            <Layout className="container">
                <Sider trigger={null} collapsible collapsed={this.state.collapsed}>
                    <div className="logo"></div>
                    <Menu theme="dark" mode="inline" defaultSelectedKeys={defaultKeys}>
                        {this.props.siders.map((item) => (
                            <Menu.Item key={item.key}>
                                <Link to={item.path}>
                                    <Icon type={item.icon} />
                                    <span>{item.name}</span>
                                </Link>
                            </Menu.Item>
                        ))}
                    </Menu>
                </Sider>
                <Layout>
                    <Header style={{ background: "#fff", padding: 0 }}>
                        <Icon 
                            className="trigger"
                            type={this.state.collapsed ? "menu-unfold" : "menu-fold"}
                            onClick={this.toggle} 
                        />
                        {this.props.header}
                    </Header>
                    <Content 
                        style={{
                            margin: '24px 16px',
                            padding: 24,
                            background: '#fff',
                            minHeight: 280,
                        }}>
                            {this.props.content}
                    </Content>
                </Layout>
            </Layout>
        )
    }
}

export default withRouter(props => <BackboneLayout {...props} />)