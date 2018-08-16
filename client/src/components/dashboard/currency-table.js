import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { MultiGrid, AutoSizer } from 'react-virtualized';
import get from 'lodash.get';
import { connect } from 'react-redux';
import { entitiesSelector as tickerSelector } from '../../ducks/tickers';
import { rowsSelector, columnsSelector } from '../../ducks/selected';
import './currency-table.less';

class CurrencyTable extends Component {
    constructor(props) {
        super(props);
        this.myRef = React.createRef();
    }

    componentDidUpdate() {
        this.myRef.current.forceUpdateGrids();
    }

    getColumnWidth = ({ columnWidth, leftColumnWidth }) => ({ index }) => {
        if (index === 0) return leftColumnWidth;
        return columnWidth;
    };

    cellRenderer = ({
        columnIndex, key, rowIndex, style,
    }) => {
        const { rows, columns, tickers } = this.props;

        if (columnIndex === 0) return this.renderLeftCell({ key, rowIndex, style });
        if (rowIndex === 0) return this.renderHeaderCell({ key, columnIndex, style });

        const baseAsset = rows[rowIndex - 1];
        const { exchange, quoteAsset } = columns[columnIndex - 1];

        return (
            <div className="table-cell" key={key} style={style}>
                {get(tickers, [exchange, baseAsset, quoteAsset, 'last_price'])}
            </div>
        );
    };

    renderLeftCell = ({
        key, rowIndex, style,
    }) => {
        const { rows } = this.props;

        return (
            <div className="left-cell" key={key} style={style}>
                {rowIndex ? rows[rowIndex - 1] : ''}
            </div>
        );
    };

    renderHeaderCell = ({
        key, columnIndex, style,
    }) => {
        const { columns } = this.props;
        const { exchange, quoteAsset } = columns[columnIndex - 1];
        return (
            <div className="header-cell" key={key} style={style}>
                <div className="exchange">{exchange}</div>
                <div className="quoteAsset">{quoteAsset}</div>
            </div>
        );
    };


    render() {
        const { rows, columns } = this.props;
        const columnWidth = 130;
        const leftColumnWidth = 70;
        const rowHeight = 40;

        const totalWidth = (columns.length * columnWidth) + leftColumnWidth;
        const totalHeight = (rows.length + 1) * rowHeight;

        return (
            <AutoSizer disableHeight>
                {({ width }) => (
                    <MultiGrid
                        ref={this.myRef}
                        cellRenderer={this.cellRenderer}
                        columnWidth={this.getColumnWidth({ columnWidth, leftColumnWidth })}
                        columnCount={columns.length + 1}
                        fixedColumnCount={1}
                        fixedRowCount={1}
                        height={totalHeight}
                        rowHeight={rowHeight}
                        rowCount={rows.length + 1}
                        width={width < totalWidth ? width : totalWidth}
                    />
                )}
            </AutoSizer>
        );
    }
}

CurrencyTable.propTypes = {
    rows: PropTypes.arrayOf(PropTypes.string).isRequired,
    columns: PropTypes.arrayOf(PropTypes.object).isRequired,
    tickers: PropTypes.shape({}).isRequired,
};

export default connect(state => ({
    tickers: tickerSelector(state),
    rows: rowsSelector(state),
    columns: columnsSelector(state),
}))(CurrencyTable);
