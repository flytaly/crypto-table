import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Button, Tooltip } from 'antd';
import { loadHistorical, isLoadingSelector, entitiesSelector } from '../../ducks/historical';
import { isChartOpenedSelector, toggleChart } from '../../ducks/selected';
import LineCharWrapper from './line-chart-wrapper';

const Charts = () => {
    const show = useSelector(isChartOpenedSelector);
    const loading = useSelector(isLoadingSelector);
    const data = useSelector(entitiesSelector);
    const dispatch = useDispatch();

    useEffect(() => {
        if (show) {
            dispatch(loadHistorical({ fsym: 'BTC', tsym: 'USD' }));
        }
    }, [dispatch, show]);

    return (
        <div>
            <Tooltip placement="right" title={show ? 'Hide charts' : 'Show charts'}>
                <Button
                    style={{ marginBottom: '16px' }}
                    onClick={() => { dispatch(toggleChart()); }}
                    loading={loading}
                    icon="line-chart"
                />
            </Tooltip>
            {show && !loading ? <LineCharWrapper data={Array.isArray(data) ? data : []} /> : null}
        </div>
    );
};

export default Charts;
