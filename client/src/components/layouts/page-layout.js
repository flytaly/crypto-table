import React, { Component } from 'react';
import { BrowserRouter as Router, Route, Redirect } from 'react-router-dom';
import { Layout } from 'antd';
import Dashboard from '../dashboard';
import Header from './header';
import './page-layout.less';

const { Content } = Layout;

class PageLayout extends Component {
    render() {
        return (
            <Router>
                <Layout className="page-layout">
                    <Header />
                    <Layout>
                        <Content className="page-content">
                            <Route
                                exact
                                path="/"
                                render={() => (<Redirect to="/dashboard" />)}
                            />
                            <Route path="/dashboard" component={Dashboard} />
                        </Content>
                    </Layout>

                </Layout>
            </Router>
        );
    }
}

export default PageLayout;
