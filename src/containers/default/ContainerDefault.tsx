import React, { useState } from "react";
import {
    MenuFoldOutlined,
    MenuUnfoldOutlined,
    PlusCircleOutlined,
    UnorderedListOutlined
} from '@ant-design/icons';
import { Layout, Menu, Button, theme } from 'antd';
import { Link, Outlet } from "react-router-dom";

const { Header, Sider, Content } = Layout;

const ContainerDefault: React.FC = () => {
    const [collapsed, setCollapsed] = useState(false);
    const {
        token: { colorBgContainer, borderRadiusLG },
    } = theme.useToken();
    return (
        <Layout style={{ height: "100vh" }}>
            <Sider trigger={null} collapsible collapsed={collapsed}>
                <div className="demo-logo-vertical" />
                <Menu
                    theme="dark"
                    mode="inline"
                    defaultSelectedKeys={['1']}
                    items={[
                        {
                            key: '1',
                            icon: <UnorderedListOutlined />,
                            label: <Link to={'/'}>Categories</Link>,
                        },
                        {
                            key: '2',
                            icon: <PlusCircleOutlined />,
                            label: <Link to={'create'}>Create Category</Link>,
                        },
                        {
                            key: '3',
                            icon: <UnorderedListOutlined />,
                            label: <Link to={'products'}>Products</Link>,
                        },
                        {
                            key: '4',
                            icon: <PlusCircleOutlined />,
                            label: <Link to={'products/create'}>Create Product</Link>,
                        }
                    ]}
                />
            </Sider>
            <Layout>
                <Header style={{
                    padding: 0,
                    background: colorBgContainer,
                    display: 'flex',
                    justifyContent: 'space-between',
                    paddingRight: '1vw'
                }}>
                    <Button
                        type="text"
                        icon={collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
                        onClick={() => setCollapsed(!collapsed)}
                        style={{
                            fontSize: '16px',
                            width: 64,
                            height: 64,
                        }}
                    />
                    <div style={{ display: 'flex', gap: '1vw' }}>
                        <Link to={'register'}>
                            <Button>Register</Button>
                        </Link>
                        <Link to={'login'}>
                            <Button type="primary">Login</Button>
                        </Link>
                    </div>
                </Header>
                <Content
                    style={{
                        margin: '24px 16px',
                        padding: 24,
                        minHeight: 280,
                        background: colorBgContainer,
                        borderRadius: borderRadiusLG,
                    }}
                >
                    <Outlet />
                </Content>
            </Layout>
        </Layout>
    );
}

export default ContainerDefault;