import * as React from 'react';
import cn from 'classnames';
import PropTypes from 'prop-types';
import scrollbarSize from 'dom-helpers/util/scrollbarSize';
import { AutoSizer, Grid, ScrollSync } from 'react-virtualized';
import './sticky-multigrid.less';
import StickyHeader from './sticky-header';

class StickyMultigrid extends React.PureComponent {
    render() {
        const {
            columnCount,
            rowCount,

            renderBodyCell,
            renderHeaderCell,
            renderLeftCell,
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
                                            <Grid
                                                className={classNameLeftBottom}
                                                cellRenderer={renderLeftCell}
                                                columnWidth={leftColumnWidth}
                                                columnCount={1}
                                                height={bodyHeight}
                                                rowHeight={rowHeight}
                                                rowCount={rowCount}
                                                scrollTop={scrollTop}
                                                width={leftColumnWidth}
                                                ref={leftGridRef}
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
                                                    }}
                                                >
                                                    <Grid
                                                        className={classNameRightTop}
                                                        columnWidth={columnWidth}
                                                        columnCount={columnCount}
                                                        height={headerRowHeight}
                                                        cellRenderer={renderHeaderCell}
                                                        rowHeight={headerRowHeight}
                                                        rowCount={1}
                                                        scrollLeft={scrollLeft}
                                                        width={bodyWidth}
                                                        ref={rightTopGridRef}
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

};

export default StickyMultigrid;
