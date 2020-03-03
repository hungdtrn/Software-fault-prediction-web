import React from 'react'
import PropTypes from 'prop-types'
import { Layout, Menu, Icon } from 'antd'
import { withRouter, Link } from 'react-router-dom';
import { connect } from "react-redux";
import { loginActions } from '../../state/duck/login';

const { Header, Sider, Content } = Layout;

class BackboneLayout extends React.Component {
    static propTypes = {
        siders: PropTypes.array.isRequired,
        content: PropTypes.any,
        header: PropTypes.any
    }

    state = {
        siders: this.props.siders,
        content: this.props.content,
        collapsed: true
    }

    componentDidUpdate(prevProps) {
        if (prevProps.siders != this.props.siders || prevProps.content != this.props.content) {

            this.setState({
                ...this.state,
                siders: this.props.siders,
                content: this.props.content
            })
        }
    }

    toggle = () => {
        this.setState({
            collapsed: !this.state.collapsed
        })
    }

    logout = () => {
        this.props.logout()
        this.props.history.push("/login")
    }

    render() {
        const {pathname} = this.props.location;
        const { siders, content, collapsed } = this.state

        const defaultKeys = siders.filter((i) => i.path == pathname).map(i => i.key)

        return (
            <Layout className="container">
                <Sider trigger={null} collapsible collapsed={collapsed}>
                    <div className="logo"></div>
                    <Menu theme="dark" mode="inline" defaultSelectedKeys={defaultKeys}>
                        {siders.map((item) => (
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
                        <span
                            className="trigger" 
                            style={{ float: "right", fontSize: 14 }}
                            onClick={this.logout}
                            >
                                Logout
                        </span>
                    </Header>
                    <Content 
                        style={{
                            margin: '24px 16px',
                            padding: 24,
                            background: '#fff',
                            minHeight: 280,
                        }}>
                            {content}
                    </Content>
                </Layout>
            </Layout>
        )
    }
}

const mapDispatchToProps = ( dispatch ) => ({
    logout: () => dispatch(loginActions.logout())
})

export default connect(null, mapDispatchToProps)(withRouter(props => <BackboneLayout {...props} />))