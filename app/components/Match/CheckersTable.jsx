import React from 'react';
import {connect} from 'react-redux';
import Checker from './Checker'

class CheckersTable extends React.Component {
	showMoves(id) {
		let piece = this.props.table[id];
		if (piece.checker * this.props.turn > 0)
			this.props.showMoves(piece.paths, id);
		}
	move(id) {
		const {turn, lastChecker} = this.props;
		let pieceTo = this.props.table[id];
		let piece = this.props.table[lastChecker];
		let consume;
		if (piece.checker * turn > 0) {
			console.log('Moved', id, piece, pieceTo, piece.paths);
			let path = piece.paths.filter(path => {
				return path.points[0].id == pieceTo.id;
			})[0];
			if (path.vectors.length > 0) {
				consume = path.vectors.shift().id;
			}
			let nextTurn = path.points.length - 1 > 0
				? turn
				: -turn;
			path.points.shift();
			this.props.move(piece, pieceTo, consume, nextTurn);
			console.log('Turnings', nextTurn, turn);
			if (nextTurn == turn) {
				this.props.showMoves([path], pieceTo.id);
			}
			this.props.updateAllPaths();
		}
	}
	componentDidMount() {
		this.props.updateAllPaths()
	}
	render() {
		return (
			<div className="checkers-table center-block" style={{
				zoom: this.props.zoom,
				height: (window.innerHeight) * 3 / 4,
				width: (window.innerHeight) * 3 / 4
			}} data-whites={this.props.whites}>
				{Object.keys(this.props.table).map((a) => {
					return <Checker id={a} key={a} {...this.props.table[a]} hideMove={this.props.hideMoves} showMove={this.showMoves.bind(this)} move={this.move.bind(this)}/>
				})}
			</div>
		);
	}
}

const mapStateToProps = function(store) {
	const {table, turn, lastChecker} = store.game;
	return {table, turn, lastChecker}
}
const mapDispatchToProps = function(dispatch, ownProps) {
	return {
		hideMoves: function() {
			dispatch({type: 'hideMoves'})
		},
		showMoves: function(paths, id) {
			dispatch({type: 'showMoves', paths, id})
		},
		move: function(piece, pieceTo, consume, turn) {
			dispatch({type: 'move', piece, pieceTo, consume, turn})
		},
		updateAllPaths: function() {
			dispatch({type: 'updateAllPaths'})
		}
	}
}

export default connect(mapStateToProps, mapDispatchToProps, null, {pure: false})(CheckersTable)
