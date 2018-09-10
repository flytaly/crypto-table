import React, { Component } from 'react';
import { Cascader, Select, Button, Icon } from 'antd';
import PropTypes from 'prop-types';

const { Option } = Select;

const Selection = ({
    // eslint-disable-next-line react/prop-types
    type, listData, selectText, onChange, isLoading,
}) => {
    const common = {
        showSearch: true,
        style: {
            float: 'left',
            width: '150px',
        },
        placeholder: isLoading ? 'Loading...' : selectText,
        value: undefined,
        disabled: isLoading,
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

    clickHandler = () => {
        const { onClickAction } = this.props;
        if (onClickAction) {
            onClickAction();
        }
        this.setState({ showRowSelector: !this.state.showRowSelector });
    };

    render() {
        const { showRowSelector } = this.state;
        const { buttonText } = this.props;
        return (
            <div>
                {!showRowSelector
                    ? (
                        <Button
                            onClick={this.clickHandler}
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
    isLoading: PropTypes.bool,
    onClickAction: PropTypes.func,
};

SelectorButton.defaultProps = {
    buttonText: '',
    selectText: '',
    type: 'select',
    isLoading: false,
    onClickAction: null,
};

export default SelectorButton;
