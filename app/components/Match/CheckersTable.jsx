import React from 'react';
import {connect} from 'react-redux';
import Checker from './Checker'
import io from 'socket.io-client';
import {Rx, Observable} from 'rxjs';

class CheckersTable extends React.Component {
	constructor(p){
		super(p);
		let debug = false;
		this.state = {
			messagesRow: '',
			socketPath: debug ? 'http://localhost:3000': 'https://zarahion-tests.herokuapp.com:3000'
		};
	}
	showMoves(id) {
		let piece = this.props.table[id];
		if (piece.checker * this.props.turn > 0 && piece.paths.length > 0) {
			console.log('Show move', piece.paths, id);
			this.props.showMoves(piece.paths, id);
		}
	}
	move(id) {
		const {turn, lastChecker} = this.props;
		let pieceTo = this.props.table[id];
		let piece = this.props.table[lastChecker];
		let consume;
		//debugger;
		if (piece.checker * turn > 0) {
			//console.log('Moved', id, piece, pieceTo, piece.paths);
			let paths = piece.paths.filter(path => {
				return path.points[0].id == pieceTo.id;
			});
			let path = paths[0];
			if (path.vectors.length > 0) {
				consume = path.vectors[0].id;
			}
			paths = paths.map(p=>{return {...p,
				points:p.points.slice(1),
				vectors: p.vectors.slice(1)}
			}).	filter(p=>
				p.points.length > 0);
			path = paths[0];
			let nextTurn = path && path.points.length > 0
				? turn
				: -turn;
			this.socket.emit('move',{piece, pieceTo, consume, nextTurn, turn, paths});
			this.props.move(piece, pieceTo, consume, nextTurn);
			//console.log('Turnings', nextTurn, turn);
			if (nextTurn == turn) {
				//console.log('Show next move', paths, pieceTo.id);
					this.props.hideMoves();
				this.props.showMoves(paths, pieceTo.id);
			} else {
				this.props.hideMoves();
			}
			this.props.updateAllPaths();
		}
	}
	componentDidMount() {
		this.props.updateAllPaths();
		console.log('Checkers table mounted', this.state);
		this.socket = io(this.state.socketPath);
		const $moves = Observable.fromEvent(this.socket, 'move'); //demobug, $ = strem
		const $demo = Observable.fromEvent(this.socket, 'demo'); //demobug, $ = strem
		const $won = Observable.fromEvent(this.socket, 'won');
		$demo.subscribe(data=> console.log(data));
		const $stop = Observable.merge($won);
		this.subscription = $moves
												.takeUntil($stop)
												.subscribe(a=>{
													const {piece, pieceTo, consume, nextTurn, turn, paths} = a;
													this.props.move(piece, pieceTo, consume, nextTurn)
													if (nextTurn == turn) {
														//console.log('Show next move', paths, pieceTo.id);
															this.props.hideMoves();
														this.props.showMoves(paths, pieceTo.id);
													} else {
														this.props.hideMoves();
													}
													this.props.updateAllPaths();
												});
		//socket.on('move', data=>this.setState({messagesRow:messagesRow+'$$'+data}));
		//setInterval(a=>socket.emit('move', 123), 1000)
	}
	render() {
		return (
			<div className="checkers-table">
				<div style={{position:'fixed', right:0, top: 0}}>
					<pre>{this.state.messagesRow}</pre>
				</div>
				<div className="checkers-table" data-whites={this.props.turn}>{Object.keys(this.props.table).map((a) => {
					return <Checker id={a} key={a} {...this.props.table[a]} hideMoves={this.props.hideMoves} showMoves={this.showMoves.bind(this)} move={this.move.bind(this)}/>
				})}</div>
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
