import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { entitiesSelector as tickerSelector } from '../../ducks/tickers';
import { stateSelector as selectedSelector } from '../../ducks/selected';

const get = require('lodash.get');

class CurrencyTable extends Component {
    render() {
        const { selected: { rows, columns }, tickers } = this.props;
        return (
            <table>
                <tbody>
                    <tr>
                        <td />
                        {columns.map(({ exchange, quoteAsset }) => (
                            <td key={exchange + quoteAsset}>
                                {exchange}<br />{quoteAsset}
                            </td>
                        ))}
                    </tr>
                    {
                        rows.map(baseAsset => (
                            <tr key={baseAsset}>
                                <td>{baseAsset}</td>
                                {columns.map(({ exchange, quoteAsset }) => {
                                    const lastPrice = get(tickers, [exchange, baseAsset, quoteAsset, 'last_price'], '');

                                    return (<td key={quoteAsset}>{lastPrice}</td>);
                                })}

                            </tr>
                        ))}
                </tbody>
            </table>
        );
    }
}

CurrencyTable.propTypes = {
    selected: PropTypes.shape({
        rows: PropTypes.arrayOf(PropTypes.string).isRequired,
        columns: PropTypes.arrayOf(PropTypes.object).isRequired,
    }).isRequired,
    tickers: PropTypes.shape({}).isRequired,
};
CurrencyTable.defaultProps = {};

export default connect(state => ({
    tickers: tickerSelector(state),
    selected: selectedSelector(state),
}))(CurrencyTable);
