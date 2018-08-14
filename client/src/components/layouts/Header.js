import React from 'react';
import { Layout, Menu } from 'antd';
import { Link } from 'react-router-dom';
import './Header.less';

const Header = () => (
    <Layout.Header className="header">
        <Menu
            theme="dark"
            mode="horizontal"
            defaultSelectedKeys={['1']}
            className="menu-left"
        >
            <Menu.Item key="1"><Link to="/Dashboard">Dashboard</Link></Menu.Item>
        </Menu>
    </Layout.Header>
);

export default Header;
