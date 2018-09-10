import { all } from 'redux-saga/effects';
import { saga as exchangesSaga } from '../ducks/exchanges';
import { saga as currenciesSaga } from '../ducks/currencies';
import { saga as tickersSaga } from '../ducks/tickers';
import { saga as selectedSaga } from '../ducks/selected';

export default function* rootSaga() {
    yield all([
        exchangesSaga(),
        currenciesSaga(),
        tickersSaga(),
        selectedSaga(),
    ]);
}
