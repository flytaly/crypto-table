import { createSelector } from 'reselect';
import produce from 'immer';
import { appName } from '../config';

/**
 * Constants
 * */
export const moduleName = 'selected';
const prefix = `${appName}/${moduleName}`;

export const ADD_ROW = `${prefix}/ADD_ROW`;
export const ADD_COLUMN = `${prefix}/ADD_COLUMN`;
export const DELETE_ROW = `${prefix}/DELETE_ROW`;
export const DELETE_COLUMN = `${prefix}/DELETE_COLUMN`;

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

/* eslint-disable no-param-reassign */
/* eslint-disable default-case */
export default (state = initialState, action) =>
    produce(state, (draft) => {
        const { type, payload } = action;
        switch (type) {
            case ADD_ROW:
                draft.rows.push(payload);
                break;
            case ADD_COLUMN:
                draft.columns.push({
                    exchange: payload[0],
                    quoteAsset: payload[1],
                });
                break;
            case DELETE_ROW:
                delete draft.rows.splice(payload, 1);
                break;
            case DELETE_COLUMN:
                delete draft.columns.splice(payload, 1);
                break;
        }
    });


/**
 * Selectors
 * */

export const stateSelector = state => state[moduleName];
export const rowsSelector = createSelector(stateSelector, state => state.rows);
export const columnsSelector = createSelector(stateSelector, state => state.columns);


/**
 * Action Creators
 * */
export const addRow = symbol => ({
    type: ADD_ROW,
    payload: symbol,
});

export const addColumn = data => ({
    type: ADD_COLUMN,
    payload: data,
});

export const deleteRow = rowIdx => ({
    type: DELETE_ROW,
    payload: rowIdx,
});

export const deleteColumn = columnIdx => ({
    type: DELETE_COLUMN,
    payload: columnIdx,
});

/**
 * Sagas
 */
