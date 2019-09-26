/* eslint-disable no-new */
import React, { useRef, useEffect } from 'react';
import PropTypes from 'prop-types';
import D3LineChart from './d3-line-chart';

const LineChartWrapper = ({ data }) => {
    const chartRef = useRef(null);

    useEffect(() => {
        new D3LineChart(chartRef.current, data);
    }, [data]);

    return <div ref={chartRef} />;
};

LineChartWrapper.propTypes = {
    data: PropTypes.arrayOf(PropTypes.shape({})),
};
LineChartWrapper.defaultProps = {
    data: [],
};

export default LineChartWrapper;
