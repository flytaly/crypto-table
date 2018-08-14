import React, { Component, Fragment } from 'react';
import { BrowserRouter as Router, Route, Redirect } from 'react-router-dom';
import Dashboard from '../routes/Dashboard';

class PageLayout extends Component {
    render() {
        return (
            <Router>
                <Fragment>
                    <header>Header</header>
                    <Route exact path="/" render={() => (<Redirect to="/dashboard" />)} />
                    <Route path="/dashboard" component={Dashboard} />
                </Fragment>
            </Router>
        );
    }
}

export default PageLayout;
