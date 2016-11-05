import React from 'react';
import Chat from '../Chat';
import Live from '../live/';
import NewGame from '../newgame/';
import Tournament from '../tournament/';
import SinglePlayerMatch from '../match/singleplayermatch';
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
		this.state = {
			upperTab: <Live/>,
			upperTabName: 'Live',
			upperLinks: ['Live', 'Newgame', 'Tournament'],
			socketOptions: {
				reconnection: true,
				reconnectionDelay: 500,
				reconnectionAttempts: 10
			},
			socketPath: debug ? 'http://localhost:3000' : 'https://websockety-askadar.c9users.io:8080/'
		};
	}
	componentWillMount() {
		const { socketOptions, socketPath } = this.state;
		this.setState({ socket: io(socketPath, socketOptions) });
	}

	setUpperTab(event) {
		const tabs = { 'Live': <Live />, 'Newgame': <NewGame/>, 'Tournament': <Tournament/> };
		this.setState({ upperTab: tabs[event.target.dataset.to], upperTabName: event.target.dataset.to });
	}
	render() {
		console.log(this.props, this.state, this.state.socket);
		return (
			<div className="col-md-12">
				<div className="col-md-6">
					{this.props.children && React.cloneElement(this.props.children, { socket: this.state.socket }) || <SinglePlayerMatch />}
				</div>
				<div className="col-md-6">
					<div className="panel">
						<nav role="nav" className="nav nav-tabs nav-justified">
							{this.state.upperLinks.map(link => <Li key={link} active={this.state.upperTabName === link} name={link} callback={this.setUpperTab.bind(this)}/>)}
						</nav>
						<div className="tab-content">
							{ this.state.upperTab }
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

export default Home;
