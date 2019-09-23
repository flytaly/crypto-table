import React from 'react';
import ReactDOM from 'react-dom';
import 'antd/dist/antd.less';
import registerServiceWorker from './registerServiceWorker';
import Root from './components/root';
import store from './redux/store';

ReactDOM.render(<Root store={store} />, document.getElementById('root'));
registerServiceWorker();
