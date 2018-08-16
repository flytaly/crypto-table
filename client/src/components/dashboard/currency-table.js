import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { MultiGrid, AutoSizer } from 'react-virtualized';
import { connect } from 'react-redux';
import get from 'lodash.get';
import cn from 'classnames';
import { entitiesSelector as tickerSelector } from '../../ducks/tickers';
import { rowsSelector, columnsSelector } from '../../ducks/selected';
import './currency-table.less';
import AddRowField from './add-row-field';

class CurrencyTable extends Component {
    constructor(props) {
        super(props);
        this.myRef = React.createRef();
        this.state = {
            hoveredRowIndex: null,
            hoveredColumnIndex: null,

            // Sizes
            columnWidth: 130,
            leftColumnWidth: 70,
            rowHeight: 40,
            headerRowHeight: 50,
        };
    }

    componentDidUpdate() {
        this.myRef.current.forceUpdateGrids();
    }

    mouseLeaveHandler = () => this.setState({
        hoveredRowIndex: null,
        hoveredColumnIndex: null,
    });

    cellRenderer = ({ columnIndex, key, rowIndex, style }) => {
        const { rows, columns, tickers } = this.props;

        const onMouseOver = () => this.setState({
            hoveredRowIndex: rowIndex,
            hoveredColumnIndex: columnIndex,
        });

        if (columnIndex === 0) {
            return this.renderLeftCell({
                key,
                rowIndex,
                style,
                onMouseOver,
            });
        }
        if (rowIndex === 0) {
            return this.renderHeaderCell({
                key,
                columnIndex,
                style,
                onMouseOver,
            });
        }

        const baseAsset = rows[rowIndex - 1];
        const { exchange, quoteAsset } = columns[columnIndex - 1];

        const className = cn({
            'grid-cell': true,
            'hovered-row': rowIndex === this.state.hoveredRowIndex,
        });

        return (
            <div className={className} key={key} style={style} onMouseOver={onMouseOver}>
                {get(tickers, [exchange, baseAsset, quoteAsset, 'last_price'])}
            </div>
        );
    };


    renderLeftCell = ({ key, rowIndex, style, onMouseOver }) => {
        const { rows } = this.props;

        const className = cn({
            'grid-left-cell': true,
            'hovered-row': rowIndex && rowIndex === this.state.hoveredRowIndex,
        });

        return (
            <div
                className={className}
                key={key}
                style={style}
                tabIndex={0}
                role="rowheader"
                onMouseOver={onMouseOver}
                onFocus={() => this.setState({ hoveredRowIndex: rowIndex })}
                onBlur={() => this.setState({ hoveredRowIndex: null })}
            >
                {rowIndex ? rows[rowIndex - 1] : ''}
            </div>
        );
    };

    renderHeaderCell = ({ key, columnIndex, style, onMouseOver }) => {
        const { columns } = this.props;
        const { exchange, quoteAsset } = columns[columnIndex - 1];
        const className = cn({
            'grid-header-cell': true,
            'hovered-column': columnIndex === this.state.hoveredColumnIndex,
        });

        return (
            <div
                className={className}
                key={key}
                style={style}
                tabIndex={0}
                role="columnheader"
                onMouseOver={onMouseOver}
                onFocus={() => this.setState({ hoveredColumnIndex: columnIndex })}
                onBlur={() => this.setState({ hoveredColumnIndex: null })}
            >
                <div className="quoteAsset">{quoteAsset}</div>
                <div className="exchange">{exchange}</div>
            </div>
        );
    };

    render() {
        const { rows, columns } = this.props;
        const {
            columnWidth,
            leftColumnWidth,
            rowHeight,
            headerRowHeight,
        } = this.state;

        const totalWidth = (columns.length * columnWidth) + leftColumnWidth;
        const totalHeight = (rows.length * rowHeight) + headerRowHeight;

        const getColWidth = ({ index }) => index ? columnWidth : leftColumnWidth;
        const getRowHeight = ({ index }) => index ? rowHeight : headerRowHeight;

        return (
            <AutoSizer disableHeight>
                {({ width: maxWidth }) => {
                    const width = maxWidth < totalWidth ? maxWidth : totalWidth;

                    return (
                        <div style={{ width }}>
                            <div onMouseLeave={this.mouseLeaveHandler}>
                                <MultiGrid
                                    ref={this.myRef}
                                    fixedColumnCount={1}
                                    fixedRowCount={1}
                                    cellRenderer={this.cellRenderer}
                                    columnWidth={getColWidth}
                                    columnCount={columns.length + 1}
                                    height={totalHeight}
                                    rowHeight={getRowHeight}
                                    rowCount={rows.length + 1}
                                    width={width}

                                    classNameTopRightGrid="grid-header"
                                    classNameTopLeftGrid="grid-header-corner"
                                    classNameBottomLeftGrid="grid-left"
                                    classNameBottomRightGrid="grid-body"
                                    styleBottomRightGrid={{ outline: 'none' }}

                                    enableFixedColumnScroll
                                    enableFixedRowScroll
                                />
                            </div>
                            <AddRowField />
                        </div>
                    );
                }}
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
