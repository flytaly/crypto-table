import { createSelector } from 'reselect';
import { appName } from '../config';

/**
 * Constants
 * */
export const moduleName = 'selected';
const prefix = `${appName}/${moduleName}`;

/**
 * Reducer
 * */

export const initialState = {
    rows: ['BTC', 'ETH', 'XRP'],
    columns: [{
        exchange: 'binance',
        quoteAsset: 'USDT',
    }, {
        exchange: 'binance',
        quoteAsset: 'BTC',
    }],
};

export default (state = initialState, action) => {
    const { type } = action;
    switch (type) {
        default:
            return state;
    }
};


/**
 * Selectors
 * */

export const stateSelector = state => state[moduleName];
export const rowsSelector = createSelector(stateSelector, state => state.rows);
export const columnsSelector = createSelector(stateSelector, state => state.columns);


/**
 * Action Creators
 * */


/**
 * Sagas
 */
