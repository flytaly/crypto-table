import { all, takeEvery, put, call } from 'redux-saga/effects';
import axios from 'axios';
import { createSelector } from 'reselect';
import { API_LOAD_EXCHANGES, appName } from '../config';
import { arrayToObj } from './utils';

/**
 * Constants
 * */
export const moduleName = 'exchanges';
const prefix = `${appName}/${moduleName}`;

export const LOAD_EXCHANGES_REQUEST = `${prefix}/LOAD_EXCHANGES_REQUEST`;
export const LOAD_EXCHANGES_START = `${prefix}/LOAD_EXCHANGES_START`;
export const LOAD_EXCHANGES_SUCCESS = `${prefix}/LOAD_EXCHANGES_SUCCESS`;
export const LOAD_EXCHANGES_FAIL = `${prefix}/LOAD_EXCHANGES_FAIL`;

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
        case LOAD_EXCHANGES_START:
            return { ...state, loading: true, error: null };
        case LOAD_EXCHANGES_SUCCESS:
            return { ...state, loading: false, entities: arrayToObj(payload, 'id') };
        case LOAD_EXCHANGES_FAIL:
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
export function* loadExchangesSaga() {
    yield put({ type: LOAD_EXCHANGES_START });
    try {
        const { data } = yield call(axios, API_LOAD_EXCHANGES);
        yield put({
            type: LOAD_EXCHANGES_SUCCESS,
            payload: Array.isArray(data) ? data : [],
        });
    } catch (error) {
        yield put({
            type: LOAD_EXCHANGES_FAIL,
            payload: error,
        });
    }
}

export function* saga() {
    yield all([
        takeEvery(LOAD_EXCHANGES_REQUEST, loadExchangesSaga),
    ]);

    yield loadExchangesSaga();
}
