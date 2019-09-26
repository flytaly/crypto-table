import React, { Component } from 'react';
import DocumentTitle from 'react-document-title';
import { Card } from 'antd';
import CurrencyTable from './currency-table';
import Charts from './charts';

class Dashboard extends Component {
    render() {
        return (
            <DocumentTitle title="Dashboard">
                <Card>
                    <Charts />
                    <CurrencyTable />
                </Card>
            </DocumentTitle>
        );
    }
}

export default Dashboard;
