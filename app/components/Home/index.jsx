import React from 'react';
import {Link} from 'react-router';
import Chat from '../Chat';

class Home extends React.Component {
	constructor(p, context) {
		super(p)
		this.router = context.router;
	}
	render() {
		return (
			<div className="col-md-12">
				<div className="col-md-9 row">
					<div className="panel">
						<nav role="nav" className="nav nav-tabs nav-justified">
							<li className={this.router.isActive({pathname: 'Live'})
								? 'active'
								: ''}>
								<Link to="/checkers/Live">Live</Link>
							</li>
							<li className={this.router.isActive({pathname: 'NewGame'})
								? 'active'
								: ''}>
								<Link to="/checkers/NewGame">Newgame</Link>
							</li>
							<li className={this.router.isActive({pathname: 'Tournament'})
								? 'active'
								: ''}>
								<Link to="/checkers/Tournament">Tournament</Link>
							</li>
						</nav>
						<div className="tab-content">
							{this.props.children}
						</div>
					</div>
				</div>
				<div className="col-md-3 row">
					<div className="panel">
						<Chat/>
					</div>
				</div>
			</div>
		)
	}
}

Home.contextTypes = {
	router: React.PropTypes.object.isRequired
};

export default Home;
