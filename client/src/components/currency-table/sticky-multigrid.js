/* eslint-disable no-underscore-dangle */
import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import scrollbarSize from 'dom-helpers/util/scrollbarSize';
import { AutoSizer, Grid, ScrollSync } from 'react-virtualized';
import { SortableContainer, SortableElement } from 'react-sortable-hoc';
import './sticky-multigrid.less';
import StickyHeader from './sticky-header';


const LEFT_GRID = 'LeftGrid';
const HEADER_GRID = 'HeaderGrid';

const SortableGrid = SortableContainer(({ innerGridRef, ...rest }) => (<Grid
    ref={innerGridRef}
    {...rest}
/>));

const SortableGridElem = SortableElement(({ children }) => children);

class StickyMultigrid extends PureComponent {
    _renderLeftCell = ({ key, rowIndex, style, ...rest }) => (
        <SortableGridElem
            key={key}
            index={rowIndex}
            style={style}
        >
            {this.props.renderLeftCell({
                key,
                rowIndex,
                style: {
                    cursor: 'move',
                    ...style,
                },
                ...rest,
            })}
        </SortableGridElem>
    );

    _renderHeaderCell = ({ key, columnIndex, style, ...rest }) => (
        <SortableGridElem
            key={key}
            index={columnIndex}
            style={style}
        >
            {this.props.renderHeaderCell({
                key,
                columnIndex,
                style: {
                    ...style,
                    cursor: 'move',
                    zIndex: 15,
                },
                ...rest,
            })}
        </SortableGridElem>
    );

    render() {
        const {
            columnCount,
            rowCount,

            renderBodyCell,
            // renderHeaderCell,
            // renderLeftCell,
            renderLeftHeaderCell,

            rightGridRef,
            rightTopGridRef,
            leftGridRef,
            leftTopGridRef,

            columnWidth,
            rowHeight,
            headerRowHeight,
            leftColumnWidth,

            classNameLeftTop,
            classNameLeftBottom,
            classNameRightTop,
            classNameRightBottom,

            onSortOver,
            onSortMove,
            onSortEnd,
            onSortStart,
        } = this.props;

        const totalWidth = (columnCount * columnWidth) + leftColumnWidth;
        const totalHeight = (rowCount * rowHeight) + headerRowHeight + scrollbarSize();
        const bodyHeight = totalHeight - headerRowHeight;

        return (
            <ScrollSync>
                {({ onScroll, scrollLeft, scrollTop }) => (
                    <div
                        className="grid-container"
                        style={{ height: totalHeight }}
                    >
                        <AutoSizer disableHeight>
                            {({ width }) => {
                                const bodyWidth = width < totalWidth
                                    ? width - leftColumnWidth
                                    : totalWidth - leftColumnWidth;

                                return (
                                    <React.Fragment>
                                        {/* LEFT COLUMN */}
                                        <div
                                            className="grid-container-left"
                                            style={{
                                                top: headerRowHeight,
                                                width: leftColumnWidth,
                                            }}
                                        >
                                            <SortableGrid
                                                className={classNameLeftBottom}
                                                cellRenderer={this._renderLeftCell}
                                                columnWidth={leftColumnWidth}
                                                columnCount={1}
                                                height={bodyHeight}
                                                rowHeight={rowHeight}
                                                rowCount={rowCount}
                                                scrollTop={scrollTop}
                                                width={leftColumnWidth}
                                                innerGridRef={leftGridRef}

                                                onSortEnd={onSortEnd(LEFT_GRID)}
                                                onSortStart={onSortStart(LEFT_GRID)}
                                                onSortMove={onSortMove(LEFT_GRID)}
                                                onSortOver={onSortOver(LEFT_GRID)}
                                                axis="y"
                                                lockAxis="y"
                                                useWindowAsScrollContainer
                                            />
                                        </div>

                                        <StickyHeader
                                            top=".header"
                                            bottom="#tableBody"
                                            height={headerRowHeight}
                                        >
                                            <div>
                                                {/* LEFT CORNER HEADER */}
                                                <div
                                                    className="grid-container-left"
                                                    style={{
                                                        height: headerRowHeight,
                                                        width: leftColumnWidth,
                                                    }}
                                                >
                                                    <Grid
                                                        cellRenderer={renderLeftHeaderCell}
                                                        className={classNameLeftTop}
                                                        width={leftColumnWidth}
                                                        height={headerRowHeight}
                                                        rowHeight={headerRowHeight}
                                                        columnWidth={leftColumnWidth}
                                                        rowCount={1}
                                                        columnCount={1}
                                                        ref={leftTopGridRef}
                                                    />
                                                </div>

                                                {/* HEADER RIGHT */}
                                                <div
                                                    className="grid-container-right"
                                                    style={{
                                                        left: leftColumnWidth,
                                                        height: headerRowHeight,
                                                        width: bodyWidth,
                                                        overflow: 'hidden',
                                                    }}
                                                >
                                                    <SortableGrid
                                                        className={classNameRightTop}
                                                        columnWidth={columnWidth}
                                                        columnCount={columnCount}
                                                        // hide scrollbar inside parent container with overflow: hidden
                                                        height={headerRowHeight + scrollbarSize()}
                                                        cellRenderer={this._renderHeaderCell}
                                                        rowHeight={headerRowHeight}
                                                        rowCount={1}
                                                        scrollLeft={scrollLeft}
                                                        onScroll={onScroll}
                                                        width={bodyWidth}
                                                        innerGrid={rightTopGridRef}

                                                        onSortEnd={onSortEnd(HEADER_GRID)}
                                                        onSortStart={onSortStart(HEADER_GRID)}
                                                        onSortMove={onSortMove(HEADER_GRID)}
                                                        onSortOver={onSortOver(HEADER_GRID)}
                                                        axis="x"
                                                        lockAxis="x"
                                                        lockToContainerEdges
                                                    />
                                                </div>
                                            </div>
                                        </StickyHeader>

                                        {/* TABLE BODY */}
                                        <div
                                            className="grid-container-right"
                                            id="tableBody"
                                            style={{
                                                left: leftColumnWidth,
                                                top: headerRowHeight,
                                                height: bodyHeight,
                                                width: bodyWidth,
                                            }}
                                        >
                                            <Grid
                                                className={classNameRightBottom}
                                                columnWidth={columnWidth}
                                                columnCount={columnCount}
                                                height={bodyHeight}
                                                onScroll={onScroll}
                                                scrollLeft={scrollLeft}
                                                cellRenderer={renderBodyCell}
                                                rowHeight={rowHeight}
                                                rowCount={rowCount}
                                                width={bodyWidth}
                                                ref={rightGridRef}
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


StickyMultigrid.propTypes = {
    columnCount: PropTypes.number.isRequired,
    rowCount: PropTypes.number.isRequired,

    classNameLeftTop: PropTypes.string,
    classNameLeftBottom: PropTypes.string,
    classNameRightTop: PropTypes.string,
    classNameRightBottom: PropTypes.string,

    renderLeftHeaderCell: PropTypes.func.isRequired,
    renderLeftCell: PropTypes.func.isRequired,
    renderHeaderCell: PropTypes.func.isRequired,
    renderBodyCell: PropTypes.func.isRequired,

    columnWidth: PropTypes.number.isRequired,
    leftColumnWidth: PropTypes.number.isRequired,
    rowHeight: PropTypes.number.isRequired,
    headerRowHeight: PropTypes.number.isRequired,

    leftGridRef: PropTypes.func,
    leftTopGridRef: PropTypes.func,
    rightGridRef: PropTypes.func,
    rightTopGridRef: PropTypes.func,

    onSortStart: PropTypes.func,
    onSortMove: PropTypes.func,
    onSortOver: PropTypes.func,
    onSortEnd: PropTypes.func,
};

StickyMultigrid.defaultProps = {

    classNameLeftTop: '',
    classNameLeftBottom: '',
    classNameRightTop: '',
    classNameRightBottom: '',

    leftGridRef: null,
    leftTopGridRef: null,
    rightGridRef: null,
    rightTopGridRef: null,

    onSortStart: () => null,
    onSortMove: () => null,
    onSortOver: () => null,
    onSortEnd: () => null,
};

export default StickyMultigrid;
