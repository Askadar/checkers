import React from 'react';
import {connect} from 'react-redux';
import Checker from './Checker'

class CheckersTable extends React.Component {
	render() {
		return (
			<div className="checkers-table center-block" style={{
				zoom: this.props.zoom,
				height: (window.innerHeight) * 3 / 4,
				width: (window.innerHeight) * 3 / 4
			}} data-whites={this.props.whites}>
				{Object.keys(this.props.table).map((a) => {
					return <Checker id={a} key={a} {...this.props.table[a]} hideMove={this.props.hideMove} showMove={this.props.showMove} move={this.props.move}/>
				})}
			</div>
		);
	}
}

const mapStateToProps = function(store) {
	return {table: store.game.table, turn: store.game.turn}
}
const mapDispatchToProps = function(dispatch, ownProps) {
	return {
		hideMove: function() {
			dispatch({type: 'hideMove'})
		},
		showMove: function(id) {
			dispatch({type: 'showMove', id})
		},
		move: function(id) {
			dispatch({type: 'move', id})
		}
	}
}

export default connect(mapStateToProps, mapDispatchToProps, null, {pure: false})(CheckersTable)
