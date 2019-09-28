import React from 'react';
import DocumentTitle from 'react-document-title';
import { Card } from 'antd';
import { useDispatch } from 'react-redux';
import CurrencyTable from './currency-table';
import Charts from './charts';
import { changeChartPairs } from '../ducks/selected';


const Dashboard = () => {
    const dispatch = useDispatch();
    const tableClickHandler = (e) => {
        const { pair } = e.target.dataset;
        if (pair) {
            const split = pair.split('__');
            if (split[0] !== split[1]) { dispatch(changeChartPairs(split)); }
        }
    };
    return (
        <DocumentTitle title="Dashboard">
            <Card>
                <Charts />
                <CurrencyTable
                    onBodyClick={tableClickHandler}
                />
            </Card>
        </DocumentTitle>
    );
};

export default Dashboard;
