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

		const socketOptions = {
			reconnection: true,
			reconnectionDelay: 500,
			reconnectionAttempts: 10
		};
		const socketPath = debug ? 'http://localhost:3000' : 'https://websockety-askadar.c9users.io:8080/';

		this.state = {
			upperTabName: upperLinks[0],
			upperLinks,
			socket: io(socketPath, socketOptions)
		};
	}
	componentWillMount() {
		const { socket } = this.state;
		const { router, resetBoard } = this.props;
		socket.on('roomCreated', data => {
			resetBoard();
			router.push('/checkers/match/' + data);
		});
	}
	setUpperTab(event) {
		// const tabs = { 'Live': <Live />, 'NewGame': <NewGame/>, 'Tournament': <Tournament/> };
		this.setState({ upperTab: window.RR[event.target.dataset.to], upperTabName: event.target.dataset.to });
	}
	playHandler(data) {
		const { socket } = this.state;
		const { selectedType, selectedTime } = data;
		socket.emit('play', { type: selectedType, time: selectedTime });
	}
	render() {
		const { socket, upperLinks, upperTabName } = this.state;
		const { setUpperTab, playHandler } = this;
		return (
			<HomeView socket={socket} upperLinks={upperLinks} upperTabName={upperTabName} setUpperTabHandler={setUpperTab.bind(this)} playHandler={playHandler.bind(this)}/>
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
