/* eslint-disable no-new */
import React, { useRef, useEffect } from 'react';
import PropTypes from 'prop-types';
import D3LineChart from './d3-line-chart';

const LineChartWrapper = ({ data, xSymbol, ySymbol, loading }) => {
    const containerRef = useRef(null);
    const instanceRef = useRef(null);

    useEffect(() => {
        if (!instanceRef.current) {
            instanceRef.current = new D3LineChart(containerRef.current, data, xSymbol, ySymbol, loading);
        } else {
            instanceRef.current.update({ data, xSymbol, ySymbol }, loading);
        }
    }, [data, loading, xSymbol, ySymbol]);

    return <div ref={containerRef} />;
};

LineChartWrapper.propTypes = {
    data: PropTypes.arrayOf(PropTypes.shape({})).isRequired,
    xSymbol: PropTypes.string.isRequired,
    ySymbol: PropTypes.string.isRequired,
    loading: PropTypes.bool,
};
LineChartWrapper.defaultProps = {
    loading: false,
};

export default LineChartWrapper;
