import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Button, Tooltip } from 'antd';
import { isLoadingSelector, entitiesSelector } from '../../ducks/historical';
import {
    isChartOpenedSelector, toggleChart, changeChartZoom, chartZoomSelector, chartPairsSelector,
} from '../../ducks/selected';
import LineCharWrapper from './line-chart-wrapper';
import ZoomButtons from './zoom-buttons';
import classes from './index.module.less';
import useHistoricalData from './use-historical-data';

const Charts = () => {
    const show = useSelector(isChartOpenedSelector);
    const chartZoom = useSelector(chartZoomSelector);
    const loading = useSelector(isLoadingSelector);
    const chartPairs = useSelector(chartPairsSelector);
    const data = useSelector(entitiesSelector);
    const dispatch = useDispatch();
    const baseAsset = chartPairs[0] || 'BTC';
    const quoteAsset = chartPairs[1] || 'USD';

    useHistoricalData(dispatch, show, chartZoom, baseAsset, quoteAsset);

    return (
        <div>
            <div className={classes.optionsContainer}>
                <Tooltip placement="right" title={show ? 'Hide charts' : 'Show charts'}>
                    <Button
                        onClick={() => { dispatch(toggleChart()); }}
                        loading={loading}
                        icon="line-chart"
                        size="small"
                    />
                </Tooltip>
                {show ? (
                    <ZoomButtons
                        value={chartZoom}
                        onChange={(value) => dispatch(changeChartZoom(value))}
                    />
                ) : null}
            </div>
            {show ? (
                <LineCharWrapper
                    data={Array.isArray(data) ? data : []}
                    xSymbol={baseAsset}
                    ySymbol={quoteAsset}
                    loading={loading}
                />
            ) : null}
        </div>
    );
};

export default Charts;
