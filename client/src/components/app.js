import React, { useEffect } from 'react';
import { message } from 'antd';
import { useSelector } from 'react-redux';
import PageLayout from './layouts/page-layout';
import { errorSelector } from '../ducks/historical';

const showErrors = (err) => {
    if (err && err.message) {
        message.error(`Error during fetching historical data: ${err.message}`);
    }
};

const App = () => {
    const historicalError = useSelector(errorSelector);
    useEffect(() => {
        showErrors(historicalError);
    }, [historicalError]);

    return (
        <PageLayout />
    );
};

export default App;
