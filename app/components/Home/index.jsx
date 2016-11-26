import React from 'react';
import Chat from '../Chat';
import Live from '../live/';
import NewGame from '../newgame/';
import Tournament from '../tournament/';
import SinglePlayerMatch from '../match/singleplayermatch';
// import { connect } from 'react-redux';
// import { withRouter } from 'react-router';
// import io from 'socket.io-client';

const Li = ({ name, callback, active }) =>
	(<li className={active ? 'active' : ''}>
		<a data-to={name} onClick={callback}>{name}</a>
	</li>);

export default function Home({ socket, upperLinks, upperTabName, setUpperTabHandler, lowerTabName, lowerLinks, setLowerTabHandler, messages, matches, playHandler, children }) {
	// const { socket, upperLinks, upperTabName, setUpperTabHandler, playHandler } = this.props;
	const ArbitraryComonent = window.RR[upperTabName];
	const LowerArbitraryComonent = window.RR[lowerTabName];
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
			<div className="col-md-4">
				<div className="panel">
				<nav role="nav" className="nav nav-tabs nav-justified">
					{lowerLinks.map(link => <Li key={link} active={lowerTabName === link} name={link} callback={setLowerTabHandler}/>)}
				</nav>
				<div className="tab-content">
					<LowerArbitraryComonent data={LowerArbitraryComonent.name === 'Chat' ? messages : matches} />
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
