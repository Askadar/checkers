import React from 'react';
import Chat from '../Chat';
import Live from '../live/';
import NewGame from '../../containers/Newgame';
import Tournament from '../tournament/';
import SinglePlayerMatch from '../match/singleplayermatch';

import ReactCSSTransitionGroup from 'react-addons-css-transition-group';
// import { connect } from 'react-redux';
// import { withRouter } from 'react-router';
// import io from 'socket.io-client';

const Li = ({ name, callback, active }) =>
	(<li className={active ? 'active' : ''}>
		<a data-to={name} onClick={callback}>{name}</a>
	</li>);

export default function Home({ socket, upperLinks, upperTabName, setUpperTabHandler, lowerTabName, lowerLinks, setLowerTabHandler, messages, matches, playHandler, children }) {
	// const { socket, upperLinks, upperTabName, setUpperTabHandler, playHandler } = this.props;
	const ArbitraryComponent = window.RR[upperTabName];
	const LowerArbitraryComponent = window.RR[lowerTabName];
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
						<ReactCSSTransitionGroup
							transitionName="tab-switch"
							className="tab-content"
							transitionEnterTimeout={600}
							transitionLeaveTimeout={300}>
							<ArbitraryComponent key={ArbitraryComponent.name} handler={ArbitraryComponent.name === 'NewGame' ? playHandler : null}/>
						</ReactCSSTransitionGroup>
				</div>
			</div>
			<div className="col-md-4">
				<div className="panel">
				<nav role="nav" className="nav nav-tabs nav-justified">
					{lowerLinks.map(link => <Li key={link} active={lowerTabName === link} name={link} callback={setLowerTabHandler}/>)}
				</nav>
					<ReactCSSTransitionGroup
						transitionName="tab-switch"
						className="tab-content"
						transitionEnterTimeout={600}
						transitionLeaveTimeout={300}>
						<LowerArbitraryComponent key={LowerArbitraryComponent.name} data={LowerArbitraryComponent.name === 'Chat' ? messages : matches} />
					</ReactCSSTransitionGroup>
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
