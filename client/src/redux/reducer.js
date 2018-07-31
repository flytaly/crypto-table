import { combineReducers } from 'redux';
import exchangesReducer, { moduleName as exchangesModule } from '../ducks/exchanges';

export default combineReducers({
    [exchangesModule]: exchangesReducer,
});
