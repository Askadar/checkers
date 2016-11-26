import React from 'react';
import { Provider } from 'react-redux';
import { Router, Route } from 'react-router';
import Home from './containers/home';
import Match from './components/match/';

export default class Root extends React.Component {
	render() {
		return (
			<Provider store={this.props.store}>
				<Router history={this.props.history}>
					<Route path="/">
						<Route path="checkers/" component={Home}>
							<Route path="match/:roomId" component={Match}/>
						</Route>
					</Route>
				</Router>
			</Provider>
		);
	}
}
