import React, { Component } from 'react';
import DocumentTitle from 'react-document-title';
import CurrencyTable from '../dashboard/currency-table';

class Dashboard extends Component {
    render() {
        return (
            <DocumentTitle title="Dashboard">
                <CurrencyTable />
            </DocumentTitle>
        );
    }
}

export default Dashboard;
