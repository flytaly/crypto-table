import { createSelector } from 'reselect';
import produce from 'immer';
import {
    all, call, takeEvery, select, put,
} from 'redux-saga/effects';
import { appName } from '../config';
// eslint-disable-next-line import/no-cycle
import { UPDATE_SUBSCRIPTION } from './tickers';

/**
 * Constants
 * */
export const moduleName = 'selected';
const prefix = `${appName}/${moduleName}`;

export const ADD_ROW = `${prefix}/ADD_ROW`;
export const ADD_COLUMN = `${prefix}/ADD_COLUMN`;
export const DELETE_ROWS = `${prefix}/DELETE_ROWS`;
export const DELETE_COLUMNS = `${prefix}/DELETE_COLUMNS`;
export const MOVE_ROW = `${prefix}/MOVE_ROW`;
export const MOVE_COLUMN = `${prefix}/MOVE_COLUMN`;
export const SORT_COLUMN = `${prefix}/SORT_COLUMN`;
export const LOAD_STATE = `${prefix}/LOAD_STATE`;
export const SET_NEW_ROW_ORDER = `${prefix}/SET_NEW_ROW_ORDER`;
export const TOGGLE_CHART = `${prefix}/TOGGLE_CHART`;

/**
 * Reducer
 * */

export const initialState = {
    isChartOpened: false,
    rows: ['BTC', 'ETH', 'XRP'],
    columns: [{
        exchange: 'binance',
        quoteAsset: 'USDT',
    }, {
        exchange: 'binance',
        quoteAsset: 'BTC',
    }],
    columnSort: {
        index: null,
        sortOrder: null,
    },
};

/* eslint-disable no-param-reassign */
/* eslint-disable default-case */
export default (state = initialState, action) => produce(state, (draft) => {
    const { type, payload } = action;
    switch (type) {
        case LOAD_STATE:
            draft.rows = payload.rows;
            draft.columns = payload.columns;
            draft.columnSort = payload.columnSort;
            draft.isChartOpened = payload.isChartOpened;
            break;
        case ADD_ROW:
            draft.rows.push(payload);
            break;
        case ADD_COLUMN:
            draft.columns.push({
                exchange: payload[0],
                quoteAsset: payload[1],
            });
            break;
        case DELETE_ROWS:
            if (Array.isArray(payload)) {
                draft.rows = draft.rows.filter((elem, idx) => !payload.includes(idx));
            }
            break;
        case DELETE_COLUMNS:
            if (Array.isArray(payload)) {
                draft.columns = draft.columns.filter((elem, idx) => !payload.includes(idx));
            }
            break;
        case MOVE_ROW: {
            const { from, to } = payload;
            draft.rows.splice(to, 0, draft.rows.splice(from, 1)[0]);
            break;
        }
        case MOVE_COLUMN: {
            const { from, to } = payload;
            draft.columns.splice(to, 0, draft.columns.splice(from, 1)[0]);
            break;
        }
        case SORT_COLUMN: {
            const { index, sortOrder } = payload;
            draft.columnSort.index = index;
            draft.columnSort.sortOrder = sortOrder;
            break;
        }
        case SET_NEW_ROW_ORDER: {
            draft.rows = payload;
            break;
        }
        case TOGGLE_CHART:
            draft.isChartOpened = !draft.isChartOpened;
            break;
    }
});


/**
 * Selectors
 * */

export const stateSelector = (state) => state[moduleName];
export const rowsSelector = createSelector(stateSelector, (state) => state.rows);
export const columnsSelector = createSelector(stateSelector, (state) => state.columns);
export const sortedColumnSelector = createSelector(stateSelector, (state) => state.columnSort);
export const isChartOpenedSelector = createSelector(stateSelector, (state) => state.isChartOpened);
/**
 * Action Creators
 * */
export const addRow = (symbol) => ({
    type: ADD_ROW,
    payload: symbol,
});

export const addColumn = (data) => ({
    type: ADD_COLUMN,
    payload: data,
});

export const deleteRows = (rowsIndexes) => ({
    type: DELETE_ROWS,
    payload: rowsIndexes,
});

export const deleteColumns = (columnsIndexes) => ({
    type: DELETE_COLUMNS,
    payload: columnsIndexes,
});

export const moveRow = ({ from, to }) => ({
    type: MOVE_ROW,
    payload: { from, to },
});

export const moveColumn = ({ from, to }) => ({
    type: MOVE_COLUMN,
    payload: { from, to },
});

export const sortByColumn = (payload) => ({
    type: SORT_COLUMN,
    payload,
});

export const saveRowOrderInStore = (payload) => ({
    type: SET_NEW_ROW_ORDER,
    payload,
});

export const toggleChart = () => ({ type: TOGGLE_CHART });

/**
 * Sagas
 */

export function* saveStateOnChange() {
    const storage = window.localStorage;
    const state = yield select(stateSelector);
    yield call([storage, storage.setItem], 'state', JSON.stringify(state));
    yield put({
        type: UPDATE_SUBSCRIPTION,
        payload: { baseAssets: state.rows, quoteAssets: state.columns },
    });
}

export function* loadStateFromStorage() {
    const storage = window.localStorage;
    const stateStr = yield call([storage, storage.getItem], 'state');
    const state = JSON.parse(stateStr);
    if (state) {
        yield put({
            type: LOAD_STATE,
            payload: state,
        });
        yield put({
            type: UPDATE_SUBSCRIPTION,
            payload: { baseAssets: state.rows, quoteAssets: state.columns },
        });
    }
}

export function* saga() {
    yield all([
        yield takeEvery([
            ADD_ROW,
            ADD_COLUMN,
            DELETE_ROWS,
            DELETE_COLUMNS,
            MOVE_ROW,
            MOVE_COLUMN,
            SORT_COLUMN,
            TOGGLE_CHART,
        ], saveStateOnChange),
    ]);

    yield loadStateFromStorage();
}
