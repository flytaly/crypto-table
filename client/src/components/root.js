import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Provider } from 'react-redux';
import App from './app';

class Root extends Component {
    static propTypes = {
        store: PropTypes.shape({}).isRequired,
    };

    render() {
        return (
            <Provider store={this.props.store}>
                <App />
            </Provider>
        );
    }
}

export default Root;
