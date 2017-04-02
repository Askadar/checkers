import React from 'react';
import HomeView from '../components/HomeView';
import { connect } from 'react-redux';
import { withRouter } from 'react-router';
import io from 'socket.io-client';

class Home extends React.Component {
	constructor(p) {
		super(p);
		const name = sessionStorage.name ? sessionStorage.name : window.prompt('You\'re name?', 'Fixy');
		sessionStorage.name = name;
		const player = { name, rating: '' };
		// this.router = context.router;
		const upperLinks = ['Play'/* , 'Tournament'*/];
		const lowerLinks = [/* 'Chat',*/'Live'];

		const socketOptions = {
			reconnection: true,
			reconnectionDelay: 500,
			reconnectionAttempts: 10,
			query: sessionStorage.uid ? 'uid=' + sessionStorage.uid : null
		};
		const socketPath =
		window.local ? 'http://localhost:3000' : 'http://zarahia.com:3000';

		this.state = {
			// messages: [
			// 	{ message: 'Bacon ipsum dolor amet beef ribs adipisicing picanha prosciutto consequat, pork belly venison leberkas shankle exercitation ex ut frankfurter burgdoggen in. ', author: 'Foo' },
			// 	{ message: 'Prosciutto t-bone bresaola ex ad mollit. Aliqua venison kielbasa fugiat. Voluptate laborum esse pig veniam rump ullamco leberkas anim. ', author: 'Baz' },
			// 	{ message: 'Aute biltong commodo bacon id, porchetta beef ribs kielbasa.', author: 'Baz' },
			// 	{ message: ' Commodo andouille esse officia elit veniam biltong.', author: 'Foo' },
			// 	{ message: 'Capicola bacon beef ex bresaola, andouille ad tenderloin.', author: 'Foo' }
			// ],
			player,
			room: '',
			matches: [
				// { players: ['Яшко (3085)', 'Ляшко (3627)'], roomId: 375854 },
				// { players: ['Панко (3125)', 'Ганко (3485)'], roomId: 375855 },
				// { players: ['Zaggy (8643)', 'Faggy (7953)'], roomId: 375875 },
				// { players: ['Purplebro (ovah9000)', 'VioletSis (ovah9000)'], roomId: 37567 }
			],
			upperTabName: upperLinks[0],
			upperLinks,
			lowerTabName: lowerLinks[0],
			lowerLinks,
			socket: io(socketPath, socketOptions),
			status: 'connecting'
		};
	}
	componentWillMount() {
		const { socket } = this.state;
		const { router, resetBoard } = this.props;
		socket.on('roomCreated', data => {
			resetBoard();
			this.setState({ room: data });
			router.push('/checkers/match/' + data);
		});
		socket.on('alreadyPlaying', data => {
			if (confirm(locale.alreadyPlaying(data))) {
				resetBoard();
				this.setState({ room: data });
				router.push('/checkers/match/' + data);
			}
		});
		socket.on('uid', uid => {
			sessionStorage.uid = uid;
		});
		// socket.on('message', data => {
		// 	console.log(data);
		// });
		socket.on('matches', data => {
			// console.log(data);
			this.setState({ matches: data });
		});
		socket.on('wrongRoom', data => {
			// console.log(data);
			router.push('/checkers/');
			// this.setState({ matches: data });
		});
		const connected = (a) => { this.setState({ status: 'connected' }); console.log('connected', a);};
		socket.on('connect', connected);
		// socket.on('reconnect', connected);

		// socket.emit('requestMatches');
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
		const { socket, room, player, upperLinks, upperTabName, lowerLinks, lowerTabName, messages, matches, status } = this.state;
		const { setUpperTab, setLowerTab, playHandler } = this;
		return (
			<HomeView socket={socket} room={room} player={player} upperLinks={upperLinks} upperTabName={upperTabName} lowerLinks={lowerLinks} lowerTabName={lowerTabName} setUpperTabHandler={setUpperTab.bind(this)} setLowerTabHandler={setLowerTab.bind(this)} playHandler={playHandler.bind(this)} status={status} messages={messages} matches={matches} children={this.props.children}/>
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
