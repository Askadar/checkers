import React from 'react';
import {Provider} from 'react-redux';
import {Router, Route} from 'react-router';
import Login from './components/login';
import Home from './components/home/';
import Match from './components/match/';
import Live from './components/live/';
import NewGame from './components/newgame/';
import Tournament from './components/tournament/';

export default class Root extends React.Component {
	render() {
		return (
			<Provider store={this.props.store}>
				<Router history={this.props.history}>
					{/* <Route path="/" component={Login}/> */}
					<Route path="/" component={Home}>
						<Route name="Live" path="/Live" component={Live}/>
						<Route path="/NewGame" component={NewGame}/>
						<Route path="/Tournament" component={Tournament}/>
						<Route path="/match/:firstPlayer-:secondPlayer" component={Match}/>
					</Route>
				</Router>
			</Provider>
		)
	}
}
