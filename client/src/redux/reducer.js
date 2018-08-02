import { combineReducers } from 'redux';
import exchangesReducer, { moduleName as exchangesModule } from '../ducks/exchanges';
import currenciesReducer, { moduleName as currenciesModule } from '../ducks/currencies';

export default combineReducers({
    [exchangesModule]: exchangesReducer,
    [currenciesModule]: currenciesReducer,
});
