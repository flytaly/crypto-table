import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import registerServiceWorker from './registerServiceWorker';
import Root from './components/Root';
import store from './redux/store';

ReactDOM.render(<Root store={store} />, document.getElementById('root'));
registerServiceWorker();
