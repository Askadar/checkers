import React from 'react';
import { Provider } from 'react-redux';
import { Router, Route } from 'react-router';
import Home from './containers/home';
import Match from './components/match/';

class Test extends React.Component {
	render() {
		return(<div>Zagert activated his powah!! <a href="/checkers/">Move it dammit!</a></div>);
	}
}

window.debug = false;

export default class Root extends React.Component {
	render() {
		return (
			<Provider store={this.props.store}>
				<Router history={this.props.history}>
					<Route path="/">
						<Route path="/checkers/" component={Home}>
							<Route path="/checkers/match/:roomId" component={Match}/>
						</Route>

						<Route path="/checkers/zag/" component={Test}/>
					</Route>
				</Router>
			</Provider>
		);
	}
}
