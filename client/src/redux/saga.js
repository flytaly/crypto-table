import { all } from 'redux-saga/effects';
import { saga as exchangesSaga } from '../ducks/exchanges';
import { saga as currenciesSaga } from '../ducks/currencies';

export default function* rootSaga() {
    yield all([
        exchangesSaga(),
        currenciesSaga(),
    ]);
}
