import { Icon } from 'antd';
import PropTypes from 'prop-types';
import React from 'react';

const DeleteIcon = ({ onClick }) => (<Icon
    type="delete"
    theme="outlined"
    style={{
        fontSize: '1.2rem',
        color: '#f5222d',
    }}
    onClick={onClick}
/>);

DeleteIcon.propTypes = { onClick: PropTypes.func.isRequired };

export default DeleteIcon;
