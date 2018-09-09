import React, { Component } from 'react';
import PropTypes from 'prop-types';

class StickyHeader extends Component {
    constructor(props) {
        super(props);

        // eslint-disable-next-line no-unused-expressions
        this.stickyContainer;

        this.topBoundElem = null;
        this.bottomBoundElem = null;

        this.scrollTop = 0;

        this.state = {
            stickyTopY: 0, // initial top offset of sticky element
            stickyBottomY: 0, // initial bottom offset of sticky element
            topBound: 0, // sticky element will be fixed when reach it
            bottomBound: Infinity, // sticky elem will be released again when reach it
            stickyTop: 0, // property 'top' of sticky container
            isFixed: false, // determinate property 'position' of sticky elem
        };
    }

    componentDidMount() {
        this.scrollTop = window.pageYOffset;
        this.setState(this.calcDimensions()); // eslint-disable-line react/no-did-mount-set-state
        document.addEventListener('scroll', this.scrollHandler);
    }

    componentDidUpdate() {
        const dims = this.calcDimensions();
        const { topBound, bottomBound } = this.state;

        if (dims.topBound !== topBound || dims.bottomBound !== bottomBound) {
            this.setState(dims); // eslint-disable-line react/no-did-update-set-state
        }
    }

    getTopBoundary() {
        const { top } = this.props;

        if (typeof top === 'string') {
            if (!this.topBoundElem) {
                this.topBoundElem = document.querySelector(top);
            }

            return this.topBoundElem ? this.topBoundElem.offsetHeight : 0;
        }

        return top;
    }

    getBottomBoundary() {
        const { bottom } = this.props;

        if (typeof bottom === 'string') {
            if (!this.bottomBoundElem) {
                this.bottomBoundElem = document.querySelector(bottom);
            }

            if (this.bottomBoundElem) {
                const rect = this.bottomBoundElem.getBoundingClientRect();
                return this.scrollTop + rect.bottom;
            }
        }

        return bottom;
    }

    scrollHandler = () => {
        this.scrollTop = window.pageYOffset;
        this.updateHeaderPosition();
    };


    calcDimensions() {
        const { top, bottom } = this.stickyContainer.getBoundingClientRect();

        return ({
            stickyTopY: this.scrollTop + top,
            stickyBottomY: this.scrollTop + bottom,
            topBound: this.getTopBoundary(),
            bottomBound: this.getBottomBoundary(),
        });
    }

    updateHeaderPosition() {
        const { topBound, bottomBound, stickyBottomY, stickyTopY } = this.state;

        const scrollUntilFix = stickyTopY - topBound;
        const scrollUntilUnfix = (bottomBound - stickyBottomY) + scrollUntilFix;

        if (this.scrollTop <= scrollUntilFix) {
            this.setState({
                isFixed: false,
                stickyTop: 0,
            });
        } else if (this.scrollTop >= scrollUntilUnfix) {
            this.setState({
                isFixed: false,
                stickyTop: bottomBound - stickyBottomY,
            });
        } else {
            this.setState({
                isFixed: true,
                stickyTop: topBound,
            });
        }
    }


    render() {
        return (
            <div
                ref={(ref) => {
                    this.stickyContainer = ref;
                }}
                style={{
                    position: this.state.isFixed ? 'fixed' : 'relative',
                    top: this.state.stickyTop,
                    zIndex: 10,
                    height: this.props.height,
                }}
            >
                {this.props.children}
            </div>
        );
    }
}

StickyHeader.propTypes = {
    children: PropTypes.node.isRequired,

    /** A query selector string or a number of pixels to which header will stick то */
    top: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),

    /** A query selector string or a number of pixels after which header will be released */
    bottom: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),

    /** Height of sticky header */
    height: PropTypes.number.isRequired,
};

StickyHeader.defaultProps = {
    top: 0,
    bottom: Infinity,
};

export default StickyHeader;
