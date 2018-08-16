import React, { Component } from 'react';
import { Select, Button, Icon } from 'antd';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { entitiesSelector as currenciesSelector } from '../../ducks/currencies';
import { addRow } from '../../ducks/selected';

const { Option } = Select;

class AddRowField extends Component {
    state = {
        showSelector: false,
    };

    // handleBlur = () => this.setState({ showSelector: false });

    render() {
        const { showSelector } = this.state;
        const { currencies } = this.props;

        return (
            <div>
                {showSelector
                    ? (
                        <Select
                            showSearch
                            style={{ width: '100%' }}
                            placeholder="Select a currency"
                            optionFilterProp="children"
                            onChange={value => this.props.addRow(value)}
                            value={undefined}
                            // onBlur={this.handleBlur}
                        >
                            {
                                Object.keys(currencies)
                                    .map(symbol => (
                                        <Option value={symbol} key={symbol}>
                                            {`${symbol} (${currencies[symbol].name})`}
                                        </Option>
                                    ))
                            }
                        </Select>
                    )
                    : (
                        <Button
                            onClick={() => this.setState({ showSelector: !showSelector })}
                            type="dashed"
                            block
                        >
                            <Icon type="plus" />
                        </Button>
                    )
                }
            </div>
        );
    }
}

AddRowField.propTypes = {
    currencies: PropTypes.shape({}).isRequired,
    addRow: PropTypes.func.isRequired,
};

const mapStateToProps = state => ({ currencies: currenciesSelector(state) });

export default connect(mapStateToProps, { addRow })(AddRowField);
