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
			upperTab: <Live/>,
			upperTabName: upperLinks[0],
			upperLinks,
			socket: io(socketPath, socketOptions)
		};
	}
	// componentWillMount() {
	// 	const { socketOptions, socketPath } = this.state;
	// 	this.setState({ socket: io(socketPath, socketOptions) });
	// }
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
		let ArbitraryComonent = window.RR[this.state.upperTabName];
		const { socket } = this.state;
		return (
			<div className="col-md-12">
				<div className="col-md-6">
					{this.props.children && React.cloneElement(this.props.children, { socket: this.state.socket }) || <SinglePlayerMatch />}
				</div>
				<div className="col-md-4">
					<div className="panel">
						<nav role="nav" className="nav nav-tabs nav-justified">
							{this.state.upperLinks.map(link => <Li key={link} active={this.state.upperTabName === link} name={link} callback={this.setUpperTab.bind(this)}/>)}
						</nav>
						<div className="tab-content">
							<ArbitraryComonent handler={ArbitraryComonent.name === 'NewGame' ? this.playHandler.bind(this) : null}/>
						</div>
					</div>
				</div>
			</div>
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
