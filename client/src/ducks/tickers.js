import io from 'socket.io-client';
import { call, take, put, fork, takeEvery } from 'redux-saga/effects';
import { eventChannel } from 'redux-saga';
import { appName, IOSERVER } from '../config';

/**
 * Constants
 * */
export const moduleName = 'tickers';
const prefix = `${appName}/${moduleName}`;

export const SUBSCRIBE = `${prefix}/SUBSCRIBE`;
export const UNSUBSCRIBE = `${prefix}/UNSUBSCRIBE`;
export const UPDATE_TICKER = `${prefix}/UPDATE_TICKER`;

/**
 * Reducer
 * */

export const initialState = {
    entities: {},
};

export default (state = initialState, action) => {
    const { type, payload } = action;
    switch (type) {
        default:
            return state;
    }
};

/**
 * Selectors
 * */
export const stateSelector = state => state[moduleName];

/**
 * Action Creators
 * */


/**
 * Sagas
 */

const createTickerChannel = socket => eventChannel((emit) => {
    socket.on('ticker', (data) => {
        emit({ data });
    });

    socket.on('connect', () => {
        socket.emit('subscribeToUpdates');
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

        const wsChannel = yield call(createTickerChannel, socket);

        yield takeEvery(wsChannel, function* ({ data }) {
            yield put({
                type: UPDATE_TICKER,
                payload: data,
            });
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
