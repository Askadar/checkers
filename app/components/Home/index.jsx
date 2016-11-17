import React from 'react';
import Chat from '../Chat';
import Live from '../live/';
import NewGame from '../newgame/';
import Tournament from '../tournament/';
import SinglePlayerMatch from '../match/singleplayermatch';
import { connect } from 'react-redux';
import { withRouter } from 'react-router';
import io from 'socket.io-client';

const Li = ({ name, callback, active }) =>
	(<li className={active ? 'active' : ''}>
		<a data-to={name} onClick={callback}>{name}</a>
	</li>);

// class Home extends React.Component {
	// constructor(p, context) {
	// 	super(p);
	// 	let debug = false;
	// 	this.router = context.router;
	// 	const upperLinks = ['Play', 'Tournament'];
	//
	// 	const socketOptions = {
	// 		reconnection: true,
	// 		reconnectionDelay: 500,
	// 		reconnectionAttempts: 10
	// 	};
	// 	const socketPath = debug ? 'http://localhost:3000' : 'https://websockety-askadar.c9users.io:8080/';
	//
	// 	this.state = {
	// 		upperTab: <Live/>,
	// 		upperTabName: upperLinks[0],
	// 		upperLinks,
	// 		socket: io(socketPath, socketOptions)
	// 	};
	// }
	// // componentWillMount() {
	// // 	const { socketOptions, socketPath } = this.state;
	// // 	this.setState({ socket: io(socketPath, socketOptions) });
	// // }
	// componentWillMount() {
	// 	const { socket } = this.state;
	// 	const { router, resetBoard } = this.props;
	// 	socket.on('roomCreated', data => {
	// 		resetBoard();
	// 		router.push('/checkers/match/' + data);
	// 	});
	// }
	// setUpperTab(event) {
	// 	// const tabs = { 'Live': <Live />, 'NewGame': <NewGame/>, 'Tournament': <Tournament/> };
	// 	this.setState({ upperTab: window.RR[event.target.dataset.to], upperTabName: event.target.dataset.to });
	// }
	// playHandler(data) {
	// 	const { socket } = this.state;
	// 	const { selectedType, selectedTime } = data;
	// 	socket.emit('play', { type: selectedType, time: selectedTime });
	// }

export default function Home({ socket, upperLinks, upperTabName, setUpperTabHandler, playHandler, children }) {
	// const { socket, upperLinks, upperTabName, setUpperTabHandler, playHandler } = this.props;
	const ArbitraryComonent = window.RR[upperTabName];
	return (
		<div className="col-md-12">
			<div className="col-md-6">
				{children && React.cloneElement(children, { socket }) || <SinglePlayerMatch />}
			</div>
			<div className="col-md-4">
				<div className="panel">
					<nav role="nav" className="nav nav-tabs nav-justified">
						{upperLinks.map(link => <Li key={link} active={upperTabName === link} name={link} callback={setUpperTabHandler}/>)}
					</nav>
					<div className="tab-content">
						<ArbitraryComonent handler={ArbitraryComonent.name === 'NewGame' ? playHandler : null}/>
					</div>
				</div>
			</div>
		</div>
	);
}
// }

// Home.contextTypes = {
// 	router: React.PropTypes.object.isRequired
// };

// export default withRouter(connect(null, (dispatch) => {
// 	return {
// 		resetBoard() { dispatch({ type: 'resetBoard' }); },
// 		//updateAllPaths() { dispatch({ type: 'updateAllPaths' }); }
// 	};
// })(Home));
