import React from 'react';
import Main from '../components/Main';
import Home from '../components/Home';
import TestingComponent from '../components/TestingComponent';
import {Route} from 'react-router';

export default(
	<div>
		<Route path="/" component={Main}/>
		<Route path="/test/:userTest" component={TestingComponent}/>
	</div>
);
