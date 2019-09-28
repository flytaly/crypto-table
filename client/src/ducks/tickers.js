import io from 'socket.io-client';
import {
    call, take, put, fork, takeEvery, select,
} from 'redux-saga/effects';
import { eventChannel } from 'redux-saga';
import produce from 'immer';
import { createSelector } from 'reselect';
import { appName, IOSERVER } from '../config';
// eslint-disable-next-line import/no-cycle
import { rowsSelector, columnsSelector } from './selected';

/**
 * Constants
 * */
export const moduleName = 'tickers';
const prefix = `${appName}/${moduleName}`;

export const SUBSCRIBE = `${prefix}/SUBSCRIBE`;
export const UPDATE_SUBSCRIPTION = `${prefix}/UPDATE_SUBSCRIPTION`;
export const UNSUBSCRIBE = `${prefix}/UNSUBSCRIBE`;
export const UPDATE_TICKER = `${prefix}/UPDATE_TICKER`;

/**
 * Reducer
 * */
export const initialState = {
    entities: {},
    prevEntities: {},
};

/* eslint-disable no-param-reassign */
/* eslint-disable default-case */
export default (state = initialState, action) => produce(state, (draft) => {
    const { type, payload } = action;
    switch (type) {
        case UPDATE_TICKER:
            draft.prevEntities[payload.exchange] = draft.entities[payload.exchange];
            draft.entities[payload.exchange] = payload.ticker;
            break;
    }
});

/**
 * Selectors
 * */
export const stateSelector = (state) => state[moduleName];
export const entitiesSelector = createSelector(stateSelector, (state) => state.entities);
export const prevEntitiesSelector = createSelector(stateSelector, (state) => state.prevEntities);

/**
 * Action Creators
 * */


/**
 * Sagas
 */

const createTickerChannel = (socket, assets) => eventChannel((emit) => {
    socket.on('ticker', (data) => {
        emit({ data });
    });

    socket.on('connect', () => {
        socket.emit('subscribeToUpdates', assets);
        console.log('WebSocket: subscribed to updates');
    });

    socket.on('reconnect', () => {
        console.log('WebSocket: reconnect');
    });

    socket.on('disconnect', () => {
        console.log('WebSocket: disconnected');
    });

    return () => {
        console.log('WebSocket: close socket');
        socket.close();
    };
});


export function* watchTickers() {
    while (true) {
        yield take(SUBSCRIBE);

        const socket = io.connect(IOSERVER, {
            reconnection: true,
            reconnectionDelay: 1000,
        });

        const baseAssets = yield select(rowsSelector);
        const quoteAssets = yield select(columnsSelector);

        const wsChannel = yield call(createTickerChannel, socket, { baseAssets, quoteAssets });

        yield takeEvery(wsChannel, function* updateTicker({ data }) {
            yield put({
                type: UPDATE_TICKER,
                payload: data,
            });
        });

        yield takeEvery(UPDATE_SUBSCRIPTION, function* subscribe({ payload }) {
            yield call([socket, socket.emit], 'runWatchers', payload);
        });

        yield take(UNSUBSCRIBE);
        wsChannel.close();
        console.log('UNSUBSCRIBED');
    }
}

export function* saga() {
    yield fork(watchTickers);

    yield put({
        type: SUBSCRIBE,
    });
}
