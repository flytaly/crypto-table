import { useEffect } from 'react';
import moment from 'moment';
import { loadHistorical } from '../../ducks/historical';
import { CHART_ZOOM } from '../../types';

const getStartDate = (endDate, zoom) => {
    const z = CHART_ZOOM;
    const zoomToDate = {
        [z.ONE_DAY]: () => moment(endDate).subtract(1, 'days').valueOf(),
        [z.ONE_WEEK]: () => moment(endDate).subtract(1, 'weeks').valueOf(),
        [z.ONE_MONTH]: () => moment(endDate).subtract(1, 'months').valueOf(),
        [z.THREE_MONTHS]: () => moment(endDate).subtract(3, 'months').valueOf(),
        [z.ONE_YEAR]: () => moment(endDate).subtract(1, 'year').valueOf(),
    };
    return zoomToDate[zoom]();
};

const useHistoricalData = (dispatch, show, chartZoom, baseAsset, quoteAsset) => {
    useEffect(() => {
        if (show) {
            const steps = 10;
            const endDate = Date.now();
            const startDate = getStartDate(endDate, chartZoom);
            dispatch(loadHistorical({
                fsym: baseAsset, tsym: quoteAsset, steps, startDate, endDate,
            }));
        }
    }, [dispatch, show, chartZoom, baseAsset, quoteAsset]);
};

export default useHistoricalData;
