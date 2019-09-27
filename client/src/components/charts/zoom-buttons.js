import React from 'react';
import { Radio } from 'antd';
import PropTypes from 'prop-types';
import { CHART_ZOOM as z } from '../../types';

const ZoomButtons = ({ onChange, value }) => (
    <div>
        <span>Zoom:</span>
        <Radio.Group
            size="small"
            onChange={({ target }) => onChange(target.value)}
            value={value}
        >
            <Radio.Button value={z.ONE_DAY}>1d</Radio.Button>
            <Radio.Button value={z.ONE_WEEK}>1w</Radio.Button>
            <Radio.Button value={z.ONE_MONTH}>1m</Radio.Button>
            <Radio.Button value={z.THREE_MONTHS}>3m</Radio.Button>
            <Radio.Button value={z.ONE_YEAR}>1y</Radio.Button>
        </Radio.Group>
    </div>
);

ZoomButtons.propTypes = {
    onChange: PropTypes.func.isRequired,
    value: PropTypes.string.isRequired,
};

export default ZoomButtons;
