import { combineReducers } from 'redux';
import exchangesReducer, { moduleName as exchangesModule } from '../ducks/exchanges';
import currenciesReducer, { moduleName as currenciesModule } from '../ducks/currencies';
import tickersReducer, { moduleName as tickersModule } from '../ducks/tickers';

export default combineReducers({
    [exchangesModule]: exchangesReducer,
    [currenciesModule]: currenciesReducer,
    [tickersModule]: tickersReducer,
});
