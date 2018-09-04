import React, { Component } from 'react';
import { Cascader, Select, Button, Icon } from 'antd';
import PropTypes from 'prop-types';

const { Option } = Select;

// eslint-disable-next-line react/prop-types
const Selection = ({ type, listData, selectText, onChange }) => {
    const common = {
        showSearch: true,
        style: {
            float: 'left',
            width: '150px',
        },
        placeholder: selectText,
        value: undefined,
    };

    return type === 'cascader' ? (
        <Cascader
            {...common}
            onChange={value => onChange(value)}
            options={listData}
        />
    )
        : (
            <Select
                {...common}
                optionFilterProp="children"
                onChange={value => onChange(value)}
            >
                {
                    listData.map(({ value, key, text }) => (
                        <Option value={value} key={key}>
                            {text}
                        </Option>
                    ))
                }
            </Select>
        );
};

class SelectorButton extends Component {
    state = {
        showRowSelector: false,
    };

    // handleBlur = () => this.setState({ showRowSelector: false });

    render() {
        const { showRowSelector } = this.state;
        const { buttonText } = this.props;
        return (
            <div>
                {!showRowSelector
                    ? (
                        <Button
                            onClick={() => this.setState({ showRowSelector: !showRowSelector })}
                            type="dashed"
                            style={{
                                float: 'left',
                                width: '150px',
                            }}
                            htmlType="button"
                        >
                            <Icon type="plus" /> {buttonText}
                        </Button>
                    )
                    : <Selection {...this.props} />
                }
            </div>
        );
    }
}

SelectorButton.propTypes = {
    listData: PropTypes.arrayOf(PropTypes.shape({})).isRequired,
    onChange: PropTypes.func.isRequired,
    buttonText: PropTypes.string,
    selectText: PropTypes.string,
    type: PropTypes.string,
};

SelectorButton.defaultProps = {
    buttonText: '',
    selectText: '',
    type: 'select',
};

export default SelectorButton;
