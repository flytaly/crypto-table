import { appName } from '../config';

/**
 * Constants
 * */
export const moduleName = 'exchanges';
const prefix = `${appName}/${moduleName}`;

/**
 * Reducer
 * */

export const initialState = {
    entities: {},
    loading: false,
    error: null,
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


/**
 * Action Creators
 * */


/**
 * Sagas
 */
