import * as React from 'react';
import cn from 'classnames';
import PropTypes from 'prop-types';
import scrollbarSize from 'dom-helpers/util/scrollbarSize';
import { AutoSizer, Grid, ScrollSync } from 'react-virtualized';
import './currency-table.less';

export default class CurrencyTable extends React.PureComponent {
    constructor(props, context) {
        super(props, context);

        this.leftGrid = React.createRef();
        this.rightGrid = React.createRef();
        this.rightTopGrid = React.createRef();

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
        this.leftGrid.current.forceUpdate();
        this.rightTopGrid.current.forceUpdate();
        this.rightGrid.current.forceUpdate();
    }


    mouseLeaveHandler = () => this.setState({
        hoveredRowIndex: null,
        hoveredColumnIndex: null,
    });

    mouseOverHandler = (rowIdx, colIdx) => this.setState({
        hoveredRowIndex: rowIdx,
        hoveredColumnIndex: colIdx,
    });

    renderLeftHeaderCell = ({ key, style }) => (
        <div // eslint-disable-line jsx-a11y/mouse-events-have-key-events
            style={style}
            key={key}
            onMouseOver={() => this.mouseOverHandler(null, null)}
        />);

    renderLeftCell = ({ key, rowIndex, style }) => {
        const { rows } = this.props;

        const className = cn({
            'grid-left-cell': true,
            'hovered-row': rowIndex === this.state.hoveredRowIndex,
        });

        return (
            <div
                className={className}
                key={key}
                style={style}
                tabIndex={0}
                role="rowheader"
                onMouseOver={() => this.mouseOverHandler(rowIndex, null)}
                onFocus={() => this.setState({ hoveredRowIndex: rowIndex })}
                onBlur={() => this.setState({ hoveredRowIndex: null })}
            >
                {rows[rowIndex]}
            </div>
        );
    };

    renderHeaderCell = ({ key, columnIndex, style }) => {
        const { columns } = this.props;
        const { exchange, quoteAsset } = columns[columnIndex];

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
                onMouseOver={() => this.mouseOverHandler(null, columnIndex)}
                onFocus={() => this.setState({ hoveredColumnIndex: columnIndex })}
                onBlur={() => this.setState({ hoveredColumnIndex: null })}
            >
                <div className="quoteAsset">{quoteAsset}</div>
                <div className="exchange">{exchange}</div>
            </div>
        );
    };

    renderBodyCell = ({ columnIndex, key, rowIndex, style }) => {
        const className = cn({
            'grid-cell': true,
            'hovered-row': rowIndex === this.state.hoveredRowIndex,
        });

        return (

            <div // eslint-disable-line jsx-a11y/mouse-events-have-key-events
                className={className}
                key={key}
                style={style}
                onMouseOver={() => this.mouseOverHandler(rowIndex, columnIndex)}
            >
                {'0000.00000000'}
            </div>
        );
    };

    render() {
        const { rows, columns } = this.props;
        const {
            columnWidth,
            rowHeight,
            headerRowHeight,
            leftColumnWidth,
        } = this.state;

        const columnCount = columns.length;
        const rowCount = rows.length;

        const totalWidth = (columnCount * columnWidth) + leftColumnWidth;
        const totalHeight = (rowCount * rowHeight) + headerRowHeight + scrollbarSize();
        const bodyHeight = totalHeight - headerRowHeight;


        return (
            <ScrollSync>
                {({ onScroll, scrollLeft, scrollTop }) => (
                    <div
                        className="grid-container"
                        style={{ height: totalHeight }}
                        onMouseLeave={this.mouseLeaveHandler}
                    >
                        <AutoSizer disableHeight>
                            {({ width }) => {
                                const bodyWidth = width < totalWidth
                                    ? width - leftColumnWidth
                                    : totalWidth - leftColumnWidth;

                                return (
                                    <React.Fragment>
                                        {/* LEFT CORNER HEADER */}
                                        <div
                                            className="grid-container-left"
                                            style={{
                                                height: headerRowHeight,
                                                width: leftColumnWidth,
                                            }}
                                        >
                                            <Grid
                                                cellRenderer={this.renderLeftHeaderCell}
                                                className="grid-header-corner"
                                                width={leftColumnWidth}
                                                height={headerRowHeight}
                                                rowHeight={headerRowHeight}
                                                columnWidth={leftColumnWidth}
                                                rowCount={1}
                                                columnCount={1}
                                            />
                                        </div>

                                        {/* LEFT COLUMN */}
                                        <div
                                            className="grid-container-left"
                                            style={{
                                                top: headerRowHeight,
                                                width: leftColumnWidth,
                                            }}
                                        >
                                            <Grid
                                                className="grid-left-row"
                                                cellRenderer={this.renderLeftCell}
                                                columnWidth={leftColumnWidth}
                                                columnCount={1}
                                                height={bodyHeight}
                                                rowHeight={rowHeight}
                                                rowCount={rowCount}
                                                scrollTop={scrollTop}
                                                width={leftColumnWidth}
                                                ref={this.leftGrid}
                                            />
                                        </div>

                                        {/* HEADER RIGHT */}
                                        <div
                                            className="grid-container-right"
                                            style={{
                                                left: leftColumnWidth,
                                                height: headerRowHeight,
                                                width: bodyWidth,
                                            }}
                                        >
                                            <Grid
                                                className="grid-header"
                                                columnWidth={columnWidth}
                                                columnCount={columnCount}
                                                height={headerRowHeight}
                                                cellRenderer={this.renderHeaderCell}
                                                rowHeight={headerRowHeight}
                                                rowCount={1}
                                                scrollLeft={scrollLeft}
                                                width={bodyWidth}
                                                ref={this.rightTopGrid}
                                            />
                                        </div>

                                        {/* TABLE BODY */}
                                        <div
                                            className="grid-container-right"
                                            style={{
                                                left: leftColumnWidth,
                                                top: headerRowHeight,
                                                height: bodyHeight,
                                                width: bodyWidth,
                                            }}
                                        >
                                            <Grid
                                                className="grid-body"
                                                columnWidth={columnWidth}
                                                columnCount={columnCount}
                                                height={bodyHeight}
                                                onScroll={onScroll}
                                                cellRenderer={this.renderBodyCell}
                                                rowHeight={rowHeight}
                                                rowCount={rowCount}
                                                width={bodyWidth}
                                                ref={this.rightGrid}
                                            />
                                        </div>
                                    </React.Fragment>
                                );
                            }
                            }
                        </AutoSizer>
                    </div>
                )}
            </ScrollSync>
        );
    }
}


CurrencyTable.propTypes = {
    rows: PropTypes.arrayOf(PropTypes.string),
    columns: PropTypes.arrayOf(PropTypes.object),
};

CurrencyTable.defaultProps = {
    rows: ['---', '---', '---', '---', '---', '---', '---', '---', '---', '---', '---'],
    columns: [{
        quoteAsset: '---',
        exchange: '-------',
    }, {
        quoteAsset: '---',
        exchange: '-------',
    }, {
        quoteAsset: '----',
        exchange: '-------',
    }, {}, {}, {}],
};

