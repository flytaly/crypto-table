/* eslint-disable no-unused-expressions */
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import cn from 'classnames';
import StickyMultigrid from './sticky-multigrid';
import './currency-table.less';

class CurrencyTable extends Component {
    constructor(props, context) {
        super(props, context);

        this.leftGrid;
        this.rightGrid;
        this.rightTopGrid;

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
        this.leftGrid && this.leftGrid.forceUpdate();
        this.rightTopGrid && this.rightTopGrid.forceUpdate();
        this.rightGrid && this.rightGrid.forceUpdate();
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

        const classNames = {
            classNameLeftTop: 'grid-header-left',
            classNameLeftBottom: 'grid-left-column',
            classNameRightTop: 'grid-header',
            classNameRightBottom: 'grid-body',
        };

        return (
            <StickyMultigrid
                onMouseLeave={this.mouseLeaveHandler}

                rowCount={rows.length}
                columnCount={columns.length}

                renderLeftHeaderCell={this.renderLeftHeaderCell}
                renderHeaderCell={this.renderHeaderCell}
                renderLeftCell={this.renderLeftCell}
                renderBodyCell={this.renderBodyCell}

                columnWidth={columnWidth}
                rowHeight={rowHeight}
                headerRowHeight={headerRowHeight}
                leftColumnWidth={leftColumnWidth}

                /* eslint-disable no-return-assign */
                leftGridRef={ref => this.leftGrid = ref}
                rightGridRef={ref => this.rightGrid = ref}
                rightTopGridRef={ref => this.rightTopGrid = ref}

                {...classNames}
            />
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

export default CurrencyTable;
