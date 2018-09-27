import React, { Component } from 'react';
import { AutoComplete, Cascader, Button, Icon } from 'antd';
import PropTypes from 'prop-types';

class SelectorButton extends Component {
    state = {
        showRowSelector: false,
        data: null,
        value: null,
    };

    // handleBlur = () => this.setState({ showRowSelector: false });

    handleSearch = (value) => {
        this.setState({ value });
        const { listData } = this.props; // eslint-disable-line react/prop-types
        if (!value.length) {
            this.setState({ data: null });
            return;
        }
        const escape = s => s.replace(/[-\\^$*+?.()|[\]{}]/g, '\\$&');
        const filtered = listData.filter(s => s.text.search(new RegExp(`(^|\\s|\\()${escape(value)}`, 'i')) !== -1);

        filtered.sort((a, b) => a.order - b.order);

        this.setState({
            data: filtered.slice(0, 7),
        });
    };

    clickHandler = () => {
        const { onClickAction } = this.props;
        if (onClickAction) {
            onClickAction();
        }
        this.setState({ showRowSelector: !this.state.showRowSelector });
    };

    render() {
        const { showRowSelector, value } = this.state;
        const {
            buttonText,
            type, listData, selectText, onSelect, isLoading,
        } = this.props;

        if (!showRowSelector) {
            return (
                <Button
                    onClick={this.clickHandler}
                    type="dashed"
                    style={{
                        float: 'left',
                        width: '180px',
                    }}
                    htmlType="button"
                >
                    <Icon type="plus" /> {buttonText}
                </Button>
            );
        }

        const common = {
            style: {
                float: 'left',
                width: '180px',
            },
            disabled: isLoading,
            placeholder: isLoading ? 'Loading...' : selectText,
            autoFocus: true,
        };

        return type === 'cascader'
            ? <Cascader
                {...common}
                onChange={onSelect}
                value={null}
                options={listData}
                showSearch
            />
            : <AutoComplete
                {...common}
                dataSource={this.state.data}
                onSelect={(val) => {
                    onSelect(val);
                    this.setState({ value: null, data: null });
                }}
                onSearch={this.handleSearch}
                value={value}
                allowClear
            />;
    }
}

SelectorButton.propTypes = {
    listData: PropTypes.arrayOf(PropTypes.shape({})).isRequired,
    onSelect: PropTypes.func.isRequired,
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
