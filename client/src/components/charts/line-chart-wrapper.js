/* eslint-disable no-new */
import React, { useRef, useEffect } from 'react';
import PropTypes from 'prop-types';
import D3LineChart from './d3-line-chart';

const LineChartWrapper = ({ data, xSymbol, ySymbol }) => {
    const chartRef = useRef(null);

    useEffect(() => {
        new D3LineChart(chartRef.current, data, xSymbol, ySymbol);
    }, [data, xSymbol, ySymbol]);

    return <div ref={chartRef} />;
};

LineChartWrapper.propTypes = {
    data: PropTypes.arrayOf(PropTypes.shape({})).isRequired,
    xSymbol: PropTypes.string.isRequired,
    ySymbol: PropTypes.string.isRequired,
};

export default LineChartWrapper;
