import React from 'react';
import { Link } from 'react-router';
import Chat from '../Chat';
import Live from '../live/';
import NewGame from '../newgame/';
import Tournament from '../tournament/';
import Match from '../match/';

const Li = ({ name, callback, active }) =>
	(<li className={active ? 'active' : ''}>
		<a data-to={name} onClick={callback}>{name}</a>
	</li>);

class Home extends React.Component {
	constructor(p, context) {
		super(p);
		this.router = context.router;
		this.state = { upperTab: <Live/>, upperTabName: 'Live', upperLinks: ['Live', 'Newgame', 'Tournament'] };
	}
	setUpperTab(event) {
		const tabs = { 'Live': <Live />, 'Newgame': <NewGame/>, 'Tournament': <Tournament/> };
		this.setState({ upperTab: tabs[event.target.dataset.to], upperTabName: event.target.dataset.to });
	}
	render() {
		console.log(this.props);
		return (
			<div className="col-md-12">
				<div className="col-md-6">
					{this.props.children || <Match />}
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
