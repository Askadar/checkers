import React from 'react';
import HomeView from '../components/home';
import { connect } from 'react-redux';
import { withRouter } from 'react-router';
import io from 'socket.io-client';

class Home extends React.Component {
	constructor(p, context) {
		super(p);
		let debug = true;
		this.router = context.router;
		const upperLinks = ['Play', 'Tournament'];
		const lowerLinks = ['Chat', 'Live'];

		const socketOptions = {
			reconnection: true,
			reconnectionDelay: 500,
			reconnectionAttempts: 10
		};
		const socketPath = debug ? 'http://localhost:3000' : 'https://websockety-askadar.c9users.io:8080/';

		this.state = {
			messages: [{ message: 'bla-bla', author: 'foo' }],
			matches: [{ players: [1, 2] }],
			upperTabName: upperLinks[0],
			upperLinks,
			lowerTabName: lowerLinks[0],
			lowerLinks,
			socket: io(socketPath, socketOptions)
		};
	}
	componentWillMount() {
		const { socket } = this.state;
		const { router, resetBoard } = this.props;
		console.log(router);
		socket.on('roomCreated', data => {
			resetBoard();
			router.push('/checkers/match/' + data);
		});
		socket.on('message', data => {
			console.log(data);
		});
		socket.on('matches', data => {
			this.setState({ matches: data });
		});
	}
	setUpperTab(event) {
		// const tabs = { 'Live': <Live />, 'NewGame': <NewGame/>, 'Tournament': <Tournament/> };
		this.setState({ upperTab: window.RR[event.target.dataset.to], upperTabName: event.target.dataset.to });
	}
	setLowerTab(event) {
		// const tabs = { 'Live': <Live />, 'NewGame': <NewGame/>, 'Tournament': <Tournament/> };
		this.setState({ lowerTabName: event.target.dataset.to });
	}
	playHandler(data) {
		const { socket } = this.state;
		const { selectedType, selectedTime } = data;
		socket.emit('play', { type: selectedType, time: selectedTime });
	}
	render() {
		const { socket, upperLinks, upperTabName, lowerLinks, lowerTabName, messages, matches } = this.state;
		const { setUpperTab, setLowerTab, playHandler } = this;
		return (
			<HomeView socket={socket} upperLinks={upperLinks} upperTabName={upperTabName} lowerLinks={lowerLinks} lowerTabName={lowerTabName} setUpperTabHandler={setUpperTab.bind(this)} setLowerTabHandler={setLowerTab.bind(this)} playHandler={playHandler.bind(this)} messages={messages} matches={matches} children={this.props.children}/>
		);
	}
}

Home.contextTypes = {
	router: React.PropTypes.object.isRequired
};

export default withRouter(connect(null, (dispatch) => {
	return {
		resetBoard() { dispatch({ type: 'resetBoard' }); },
		//updateAllPaths() { dispatch({ type: 'updateAllPaths' }); }
	};
})(Home));
