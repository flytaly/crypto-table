import React, { Component } from 'react';
import connect from 'react-redux/es/connect/connect';
import PropTypes from 'prop-types';
import SelectorButton from './selector-button';
import { entitiesSelector as currenciesSelector, loadingSelector, loadCurrencies } from '../../ducks/currencies';
import { entitiesSelector as exchangesSelector } from '../../ducks/exchanges';
import { addRow, addColumn } from '../../ducks/selected';

class AddTableField extends Component {
    render() {
        const { currencies, exchanges } = this.props;
        const baseCurrenciesList = Object.keys(currencies)
            .map(symbol => ({
                value: symbol,
                key: symbol,
                text: `${symbol} (${currencies[symbol].name})`,
                order: currencies[symbol].sortOrder,
            }));
        const quoteCurrenciesList = Object.keys(exchanges)
            .map((ex) => {
                const qoutes = exchanges[ex].quoteAssets.map(qoute => ({
                    value: qoute,
                    label: qoute,
                }));
                return ({
                    value: ex,
                    label: exchanges[ex].name,
                    children: qoutes,
                });
            });

        return (
            <React.Fragment>
                <SelectorButton
                    onSelect={this.props.addRow}
                    listData={baseCurrenciesList}
                    buttonText="Add row"
                    selectText="Search"
                    isLoading={this.props.isLoading}
                    onClickAction={() => this.props.loadCurrencies()}
                />
                <SelectorButton
                    onSelect={this.props.addColumn}
                    listData={quoteCurrenciesList}
                    buttonText="Add column"
                    selectText="Add column"
                    type="cascader"
                />
                <div style={{ clear: 'both' }} />
            </React.Fragment>
        );
    }
}

AddTableField.propTypes = {
    currencies: PropTypes.shape({}).isRequired,
    exchanges: PropTypes.shape({}).isRequired,
    addRow: PropTypes.func.isRequired,
    addColumn: PropTypes.func.isRequired,
    isLoading: PropTypes.bool,
    loadCurrencies: PropTypes.func.isRequired,
};

AddTableField.defaultProps = {
    isLoading: false,
};

const mapStateToProps = state => ({
    currencies: currenciesSelector(state),
    exchanges: exchangesSelector(state),
    isLoading: loadingSelector(state),
});

export default connect(mapStateToProps, {
    addRow,
    addColumn,
    loadCurrencies,
})(AddTableField);

