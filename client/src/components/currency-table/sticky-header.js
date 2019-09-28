/* eslint-disable consistent-return */
import React, { useState, useEffect, useRef } from 'react';
import PropTypes from 'prop-types';

const initialState = {
    isFixed: false,
    stickyTop: 0,
};

const useQuerySelectors = ({ top, stickyStart, stickyEnd }, setElements) => {
    const selectElement = (selector) => typeof selector === 'string' ? document.querySelector(selector) : null;
    useEffect(() => {
        setElements({
            topElem: selectElement(top),
            stickyStartElem: selectElement(stickyStart),
            stickyEndElem: selectElement(stickyEnd),
            elementsSelected: true,
        });
    }, [setElements, stickyEnd, stickyStart, top]);
};

const StickyHeader = ({
    top, stickyStart, stickyEnd, height, children, zIndex,
}) => {
    const containerRef = useRef(null);
    const [{ isFixed, stickyTop }, setState] = useState(initialState);
    const [{ topElem, stickyStartElem, stickyEndElem, elementsSelected }, setElements] = useState({});

    useQuerySelectors({ top, stickyStart, stickyEnd }, setElements);

    useEffect(() => {
        if (!elementsSelected) return;

        const stickyElem = containerRef.current;

        const scrollListener = () => {
            const topBoundary = topElem ? topElem.getBoundingClientRect().bottom : top;
            const startY = stickyStartElem ? stickyStartElem.getBoundingClientRect().top : stickyStart;
            const bottomBoundary = stickyEndElem ? stickyEndElem.getBoundingClientRect().bottom : stickyEnd;
            const stickyRect = stickyElem.getBoundingClientRect();
            const stickyYThreshold = topBoundary + height;

            if (startY > stickyYThreshold) {
                return setState(() => ({ isFixed: false, stickyTop: 0 }));
            }
            if (bottomBoundary <= stickyYThreshold) {
                return setState(() => ({ isFixed: true, stickyTop: bottomBoundary - stickyRect.height }));
            }
            if (startY <= stickyYThreshold) {
                return setState(() => ({ isFixed: true, stickyTop: topBoundary }));
            }
        };

        const throttledScrollListener = () => window.requestAnimationFrame(scrollListener);
        document.addEventListener('scroll', throttledScrollListener);

        return () => { document.removeEventListener('scroll', throttledScrollListener); };
    }, [elementsSelected, height, stickyEnd, stickyEndElem, stickyStart, stickyStartElem, top, topElem]);

    return (
        <div
            ref={containerRef}
            style={{
                position: isFixed ? 'fixed' : 'relative',
                top: stickyTop,
                zIndex,
                height,
            }}
        >
            {children}
        </div>
    );
};

StickyHeader.propTypes = {
    children: PropTypes.node.isRequired,

    /**
     * A number of pixels or a query selector string of an element to which header will stick то.
     * If isn't provided then header will stick to the top of the screen.
     */
    top: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),

    /** A query selector string of an element at the intersection with its top the header will be sticky  */
    stickyStart: PropTypes.string.isRequired,

    /** A query selector string of an element at the intersection with its bottom the header will be released  */
    stickyEnd: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),

    /** Height of sticky header */
    height: PropTypes.number,

    zIndex: PropTypes.number,
};

StickyHeader.defaultProps = {
    top: 0,
    height: null,
    stickyEnd: Infinity,
    zIndex: 10,
};

export default StickyHeader;
