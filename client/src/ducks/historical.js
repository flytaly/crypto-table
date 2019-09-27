import { all, takeEvery, put, call } from 'redux-saga/effects';
import axios from 'axios';
import { createSelector } from 'reselect';
import { API_LOAD_HISTORICAL, appName } from '../config';

/**
 * Constants
 * */
export const moduleName = 'historical';
const prefix = `${appName}/${moduleName}`;

export const LOAD_HISTORICAL_REQUEST = `${prefix}/LOAD_HISTORICAL_REQUEST`;
export const LOAD_HISTORICAL_START = `${prefix}/LOAD_HISTORICAL_START`;
export const LOAD_HISTORICAL_SUCCESS = `${prefix}/LOAD_HISTORICAL_SUCCESS`;
export const LOAD_HISTORICAL_FAIL = `${prefix}/LOAD_HISTORICAL_FAIL`;


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
        case LOAD_HISTORICAL_START:
            return { ...state, loading: true, error: null };
        case LOAD_HISTORICAL_SUCCESS:
            return { ...state, loading: false, entities: payload };
        case LOAD_HISTORICAL_FAIL:
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
export const isLoadingSelector = createSelector(stateSelector, (state) => state.loading);


/**
 * Action Creators
 * */
export const loadHistorical = (payload) => ({
    type: LOAD_HISTORICAL_REQUEST,
    payload,
});


/**
 * Sagas
 */
export function* loadHistoricalSaga({ payload }) {
    yield put({ type: LOAD_HISTORICAL_START });
    try {
        const { data } = yield call(axios, {
            url: API_LOAD_HISTORICAL,
            params: payload,
        });
        yield put({
            type: LOAD_HISTORICAL_SUCCESS,
            payload: data,
        });
    } catch (error) {
        console.error((error.response && error.response.data) || error);
        yield put({
            type: LOAD_HISTORICAL_FAIL,
            payload: error,
        });
    }
}

export function* saga() {
    yield all([
        yield takeEvery(LOAD_HISTORICAL_REQUEST, loadHistoricalSaga),
    ]);
}
