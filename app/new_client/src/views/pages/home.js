import React from 'react'
import { Layout, Menu, Icon } from 'antd'

import { UserLayout, AdminLayout } from '../layouts'
import { parseToken } from '../../state/utils/token'

const { Header, Sider, Content } = Layout;

class AdminHome extends React.Component {
    state = {
        collapsed: true
    }

    toggle = () => {
        this.setState({
            collapsed: !this.state.collapsed
        })
    }

    render() {
        return (
            <Layout>
                <Sider trigger={null} collapsible collapsed={this.state.collapsed}>
                    <div className="logo"></div>
                    <Menu theme="dark" mode="inline" defaultSelectedKeys={['1']}>
                        <Menu.Item key="1">
                            <span>Users</span>
                        </Menu.Item>
                        <Menu.Item key="2">
                            <span>Alogirthms</span>
                        </Menu.Item>
                        <Menu.Item key="3">
                            <span>Account</span>
                        </Menu.Item>
                    </Menu>
                </Sider>
                <Layout>
                    <Header style={{ background: "#fff", padding: 0 }}>
                        <Icon 
                            className="trigger"
                            type={this.state.collapsed ? "menu-unfold" : "menu-fold"}
                            onClick={this.toggle} 
                        />
                    </Header>
                    <Content 
                        style={{
                            margin: '24px 16px',
                            padding: 24,
                            background: '#fff',
                            minHeight: 280,
                        }}>
                            Content
                    </Content>
                </Layout>
            </Layout>
        )
    }
}


const HomePage = (props) => {
    const currentUser = parseToken(props.accessToken)
    console.log(currentUser)
    switch(currentUser.role) {
        case "admin": {
            return <AdminLayout {...props} />
        }
        case "user": {
            return <UserLayout {...props} />
        }
        default: {
            return <UserLayout {...props} />
        }
    }
}

export default HomePage