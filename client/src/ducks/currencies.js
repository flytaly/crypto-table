import { all, put, takeEvery, call } from 'redux-saga/effects';
import axios from 'axios';
import { createSelector } from 'reselect';
import { API_LOAD_CURRENCIES, appName } from '../config';

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
            return { ...state, loading: false, entities: payload };
        case LOAD_CURRENCIES_FAIL:
            return { ...state, loading: false, error: payload };

        default:
            return state;
    }
};

/**
 * Selectors
 * */

export const stateSelector = (state) => state[moduleName];
export const entitiesSelector = createSelector(stateSelector, (state) => state.entities);
export const loadingSelector = createSelector(stateSelector, (state) => state.loading);

/**
 * Action Creators
 * */
export const loadCurrencies = () => ({
    type: LOAD_CURRENCIES_REQUEST,
});

/**
 * Sagas
 */
export function* loadCurrenciesSaga() {
    yield put({ type: LOAD_CURRENCIES_START });
    try {
        const { data } = yield call(axios, API_LOAD_CURRENCIES);
        yield put({
            type: LOAD_CURRENCIES_SUCCESS,
            payload: data || {},
        });
    } catch (error) {
        console.error(error);
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

    // yield loadCurrenciesSaga();
}
