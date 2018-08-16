import { all, put, takeEvery, call } from 'redux-saga/effects';
import axios from 'axios';
import { createSelector } from 'reselect';
import { API_LOAD_CURRENCIES, appName } from '../config';
import { arrayToObj } from './utils';

/**
 * Constants
 * */
export const moduleName = 'currencies';
const prefix = `${appName}/${moduleName}`;

export const LOAD_CURRENCIES_REQUEST = `${prefix}/LOAD_CURRENCIES_REQUEST`;
export const LOAD_CURRENCIES_START = `${prefix}/LOAD_CURRENCIES_START`;
export const LOAD_CURRENCIES_SUCCESS = `${prefix}/LOAD_CURRENCIES_SUCCESS`;
export const LOAD_CURRENCIES_FAIL = `${prefix}/LOAD_CURRENCIES_FAIL`;


/**
 * Reducer
 * */

export const initialState = {
    entities: {},
    loading: false,
    error: null,
};

export default (state = initialState, action) => {
    const { type, payload } = action;
    switch (type) {
        case LOAD_CURRENCIES_START:
            return { ...state, loading: true, error: null };
        case LOAD_CURRENCIES_SUCCESS:
            return { ...state, loading: false, entities: arrayToObj(payload, 'symbol') };
        case LOAD_CURRENCIES_FAIL:
            return { ...state, loading: false, error: payload };

        default:
            return state;
    }
};

/**
 * Selectors
 * */

export const stateSelector = state => state[moduleName];
export const entitiesSelector = createSelector(stateSelector, state => state.entities);


/**
 * Action Creators
 * */


/**
 * Sagas
 */
export function* loadCurrenciesSaga() {
    yield put({ type: LOAD_CURRENCIES_START });
    try {
        const { data } = yield call(axios, API_LOAD_CURRENCIES);
        yield put({
            type: LOAD_CURRENCIES_SUCCESS,
            payload: Array.isArray(data) ? data : [],
        });
    } catch (error) {
        yield put({
            type: LOAD_CURRENCIES_FAIL,
            payload: error,
        });
    }
}

export function* saga() {
    yield all([
        takeEvery(LOAD_CURRENCIES_REQUEST, loadCurrenciesSaga),
    ]);

    yield loadCurrenciesSaga();
}
