import React from 'react';
import Match from './Match'

class Live extends React.Component {
	render() {
		return (
			<div id="Live">
				<ul className="list-group">
					<Match first="Человек" second="Человек" timePlayed="12:22"/>
				</ul>
			</div>
		)
	}
};

export default Live
