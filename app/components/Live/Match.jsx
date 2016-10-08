import React from 'react';
import {Link} from 'react-router';

class Match extends React.Component {
	render() {
		return (
			<li className="list-group-item">
				<Link to={`/match/${this.props.first}-${this.props.second}`}>{this.props.first}-{this.props.second}-{this.props.timePlayed}</Link>
			</li>
		)
	}
};

export default Match
