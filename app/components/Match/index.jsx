import React from 'react';
import CheckersTable from './CheckersTable'
import {connect} from 'react-redux';

class Match extends React.Component {
	render() {
		return (
			<div>
				<p>{`Играют ${this.props.routeParams.firstPlayer} и ${this.props.routeParams.secondPlayer}`}</p>
				<p>Сейчас ход {this.props.turn == 1
						? 'белых'
						: 'черных'}.</p>
				<CheckersTable/>
			</div>
		)
	}
};

export default connect((s) => {
	return {turn: s.game.turn}
})(Match)
