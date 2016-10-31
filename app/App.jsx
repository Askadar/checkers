import React from 'react';
import ReactDOM from 'react-dom';
import Root from './root';
import { browserHistory } from 'react-router';
import store from './store/configureStore';

ReactDOM.render(
	<Root store={store} history={browserHistory}/>, document.getElementById('root'));
