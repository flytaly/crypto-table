/* eslint-disable no-unused-expressions */
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import cn from 'classnames';
import get from 'lodash.get';
import { connect } from 'react-redux';
import {
    Checkbox, Icon, Popover, Tooltip, Menu,
} from 'antd';
import { entitiesSelector as tickerSelector } from '../../ducks/tickers';
import {
    rowsSelector, columnsSelector, deleteColumns, deleteRows, moveRow, moveColumn,
} from '../../ducks/selected';
import StickyMultigrid from './sticky-multigrid';
import AddTableField from './add-table-field';
import './currency-table.less';


const ROWS = 'rows';
const COLUMNS = 'columns;';
const LEFT_GRID = 'LeftGrid';
const HEADER_GRID = 'HeaderGrid';

class CurrencyTable extends Component {
    constructor(props, context) {
        super(props, context);

        this.leftGrid;
        this.leftTopGrid;
        this.rightGrid;
        this.rightTopGrid;

        this.state = {
            hoveredRowIndex: null,
            hoveredColumnIndex: null,

            showCheckboxes: null, // columns, rows, null

            rowsToDelete: new Set(),
            columnsToDelete: new Set(),

            showPopover: false,
            isDragging: false,

            // Sizes
            columnWidth: 130,
            leftColumnWidth: 100,
            rowHeight: 40,
            headerRowHeight: 50,
        };
    }

    componentDidUpdate() {
        this.leftGrid && this.leftGrid.forceUpdate();
        this.rightTopGrid && this.rightTopGrid.forceUpdate();
        this.rightGrid && this.rightGrid.forceUpdate();
        this.leftTopGrid && this.leftTopGrid.forceUpdate();
    }

    deleteSelectedRows = () => {
        const { rowsToDelete } = this.state;
        const { deleteRows } = this.props; // eslint-disable-line no-shadow

        deleteRows([...rowsToDelete]);
        this.setState({
            rowsToDelete: new Set(),
            showCheckboxes: false,
        });
    };

    deleteSelectedColumns = () => {
        const { columnsToDelete } = this.state;
        const { deleteColumns } = this.props; // eslint-disable-line no-shadow

        deleteColumns([...columnsToDelete]);
        this.setState({
            columnsToDelete: new Set(),
            showCheckboxes: false,
        });
    };

    mouseLeaveHandler = () => this.setState({
        hoveredRowIndex: null,
        hoveredColumnIndex: null,
    });

    mouseOverHandler = (rowIdx, colIdx) => this.setState({
        hoveredRowIndex: rowIdx,
        hoveredColumnIndex: colIdx,
    });

    handleEditMenuClick = ({ key }) => {
        this.setState({
            showPopover: false,
            showCheckboxes: key,
        });
    };

    sortStartHandler = () => () => this.setState({ isDragging: true });

    sortEndHandler = sortedGrid => ({ oldIndex, newIndex /* , collection */}) => {
        if (oldIndex !== newIndex) {
            if (sortedGrid === LEFT_GRID) {
                this.props.moveRow({ from: oldIndex, to: newIndex });
            }
            if (sortedGrid === HEADER_GRID) {
                this.props.moveColumn({ from: oldIndex, to: newIndex });
            }
        }

        this.setState({ isDragging: false });
    };

    renderLeftHeaderCell = ({ key, style }) => {
        const { showCheckboxes, rowsToDelete, columnsToDelete } = this.state;
        const { rows, columns } = this.props;

        const popoverContent = (
            <Menu
                onClick={this.handleEditMenuClick}
            >
                <Menu.Item key={ROWS}>
                    Delete rows...
                </Menu.Item>
                <Menu.Item key={COLUMNS}>
                    Delete columns...
                </Menu.Item>
            </Menu>
        );

        const selectAllRows = ({ target }) => this.setState({
            rowsToDelete: target.checked
                ? rows.reduce((acc, curr, idx) => acc.add(idx), new Set())
                : new Set(),
        });

        const selectAllCols = ({ target }) => this.setState({
            columnsToDelete: target.checked
                ? columns.reduce((acc, curr, idx) => acc.add(idx), new Set())
                : new Set(),
        });

        const cellContent = () => {
            switch (showCheckboxes) {
                case ROWS:
                    return (
                        <div>
                            <Checkbox
                                indeterminate={rowsToDelete.size && rowsToDelete.size < rows.length}
                                checked={rowsToDelete.size === rows.length}
                                onChange={selectAllRows}
                            />
                            <Icon
                                type="delete"
                                title="Delete rows"
                                theme="twoTone"
                                twoToneColor="#f5222d"
                                cursor="pointer"
                                onClick={this.deleteSelectedRows}
                                style={{
                                    fontSize: '1.4rem',
                                    marginLeft: '8px',
                                    cursor: 'pointer',
                                }}
                            />
                            <Icon
                                type="stop"
                                theme="outlined"
                                title="Cancel"
                                onClick={() => this.setState({
                                    showPopover: false,
                                    showCheckboxes: key,
                                    rowsToDelete: new Set(),
                                })}
                                style={{
                                    fontSize: '1.4rem',
                                    marginLeft: '8px',
                                    cursor: 'pointer',
                                }}
                            />
                        </div>
                    );
                case COLUMNS:
                    return (
                        <div>
                            <Checkbox
                                indeterminate={columnsToDelete.size && columnsToDelete.size < columns.length}
                                checked={columnsToDelete.size === columns.length}
                                onChange={selectAllCols}
                            />
                            <Icon
                                type="delete"
                                title="Delete columns"
                                theme="twoTone"
                                twoToneColor="#f5222d"
                                cursor="pointer"
                                onClick={this.deleteSelectedColumns}
                                style={{
                                    fontSize: '1.4rem',
                                    marginLeft: '8px',
                                    cursor: 'pointer',
                                }}
                            />
                            <Icon
                                type="stop"
                                theme="outlined"
                                title="Cancel"
                                onClick={() => this.setState({
                                    showPopover: false,
                                    showCheckboxes: key,
                                    columnsToDelete: new Set(),
                                })}
                                style={{
                                    fontSize: '1.4rem',
                                    marginLeft: '8px',
                                    cursor: 'pointer',
                                }}
                            />
                        </div>
                    );
                default:
                    return (
                        <Popover
                            content={popoverContent}
                            trigger="click"
                            placement="bottomRight"
                            visible={this.state.showPopover}
                            onVisibleChange={showPopover => this.setState({ showPopover })}
                        >
                            <Tooltip placement="right" title={<span>Edit table</span>}>
                                <Icon
                                    type="form"
                                    theme="outlined"
                                    style={{
                                        fontSize: '1.2rem',
                                        cursor: 'context-menu',
                                    }}
                                />
                            </Tooltip>
                        </Popover>
                    );
            }
        };

        return (
            <div // eslint-disable-line jsx-a11y/mouse-events-have-key-events
                style={style}
                key={key}
                onMouseOver={() => this.mouseOverHandler(null, null)}
                className="grid-header-left-cell"
            >
                {cellContent()}
            </div>);
    };

    renderLeftCell = ({ key, rowIndex, style }) => {
        const { rows } = this.props;
        const { showCheckboxes, rowsToDelete, isDragging } = this.state;

        const className = cn({
            'grid-left-cell': true,
            hovered: rowIndex === this.state.hoveredRowIndex,
            selected: rowsToDelete.has(rowIndex),
        });

        const changeHandler = ({ target }) => {
            if (target.checked) {
                rowsToDelete.add(rowIndex);
            } else {
                rowsToDelete.delete(rowIndex);
            }
            this.setState({ rowsToDelete: new Set(rowsToDelete) });
        };

        const checkboxes = showCheckboxes === ROWS;

        return (
            <div
                className={className}
                key={key}
                style={style}
                tabIndex={checkboxes ? null : 0}
                role="rowheader"
                onMouseOver={() => !isDragging && this.mouseOverHandler(rowIndex, null)}
                onFocus={() => this.setState({ hoveredRowIndex: rowIndex })}
                onBlur={() => this.setState({ hoveredRowIndex: null })}
            >
                {checkboxes
                    ? (
                        <Checkbox
                            checked={rowsToDelete.has(rowIndex)}
                            onChange={changeHandler}
                        >{rows[rowIndex]}
                        </Checkbox>)
                    : rows[rowIndex]}
            </div>
        );
    };

    renderHeaderCell = ({ key, columnIndex, style }) => {
        const { columns } = this.props;
        const { isDragging, showCheckboxes, columnsToDelete } = this.state;
        const { exchange, quoteAsset } = columns[columnIndex];

        const className = cn({
            'grid-header-cell': true,
            hovered: !isDragging && columnIndex === this.state.hoveredColumnIndex,
            selected: columnsToDelete.has(columnIndex),
        });

        const checkboxes = showCheckboxes === COLUMNS;

        const changeHandler = ({ target }) => {
            if (target.checked) {
                columnsToDelete.add(columnIndex);
            } else {
                columnsToDelete.delete(columnIndex);
            }
            this.setState({ columnsToDelete: new Set(columnsToDelete) });
        };

        return (
            <div
                className={className}
                key={key}
                style={style}
                tabIndex={checkboxes ? null : 0}
                role="columnheader"
                onMouseOver={() => this.mouseOverHandler(null, columnIndex)}
                onFocus={() => this.setState({ hoveredColumnIndex: columnIndex })}
                onBlur={() => this.setState({ hoveredColumnIndex: null })}
            >
                {checkboxes
                    ? <Checkbox
                        checked={columnsToDelete.has(columnIndex)}
                        onChange={changeHandler}
                    /> : null}
                <div className="grid-header-data">
                    <div className="quoteAsset">{quoteAsset}</div>
                    <div className="exchange">{exchange}</div>
                </div>
            </div>
        );
    };

    renderBodyCell = ({ columnIndex, key, rowIndex, style }) => {
        const { rows, columns, tickers } = this.props;
        const { hoveredRowIndex, isDragging, columnsToDelete, rowsToDelete } = this.state;

        const baseAsset = rows[rowIndex];
        const { exchange, quoteAsset } = columns[columnIndex];

        const className = cn({
            'grid-cell': true,
            hovered: !isDragging && rowIndex === hoveredRowIndex,
            selected: columnsToDelete.has(columnIndex) || rowsToDelete.has(rowIndex),
        });

        return (
            <div // eslint-disable-line jsx-a11y/mouse-events-have-key-events
                className={className}
                key={key}
                style={style}
                onMouseOver={() => this.mouseOverHandler(rowIndex, columnIndex)}
            >
                {get(tickers, [exchange, baseAsset, quoteAsset, 'last_price'])}
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
            <React.Fragment>
                <div onMouseLeave={this.mouseLeaveHandler}>
                    <StickyMultigrid
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
                        leftTopGridRef={ref => this.leftTopGrid = ref}

                        onSortStart={this.sortStartHandler}
                        onSortEnd={this.sortEndHandler}

                        {...classNames}
                    />
                </div>
                <AddTableField />
            </React.Fragment>
        );
    }
}

CurrencyTable.propTypes = {
    rows: PropTypes.arrayOf(PropTypes.string).isRequired,
    columns: PropTypes.arrayOf(PropTypes.object).isRequired,
    tickers: PropTypes.shape({}).isRequired,
    deleteColumns: PropTypes.func,
    deleteRows: PropTypes.func,
    moveRow: PropTypes.func,
    moveColumn: PropTypes.func,
};

CurrencyTable.defaultProps = {
    deleteColumns: (columns) => {
        console.log('Delete columns:', columns);
    },
    deleteRows: (rows) => {
        console.log('Delete rows:', rows);
    },
    moveRow: ({ from, to }) => {
        console.log(`Move row from position ${from} to ${to}`);
    },
    moveColumn: ({ from, to }) => {
        console.log(`Move column from position ${from} to ${to}`);
    },
};

export default connect(state => ({
    tickers: tickerSelector(state),
    rows: rowsSelector(state),
    columns: columnsSelector(state),
}), {
    deleteColumns,
    deleteRows,
    moveRow,
    moveColumn,
})(CurrencyTable);
