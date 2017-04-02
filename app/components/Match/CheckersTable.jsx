import React from 'react';
import { connect } from 'react-redux';
import Checker from './Checker';
import { Observable } from 'rxjs';

class CheckersTable extends React.Component {
	constructor(p) {
		super(p);

		// const debug = true;
		this.state = {
			messagesRow: '',
			letters: ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J'],
			keysMap: Object.keys(this.props.table).sort((a, b) => {
				const aKeys = a.split('-');
				const bKeys = b.split('-');
				return (bKeys[0] - aKeys[0]) * 11 + (aKeys[1].charCodeAt(0) - bKeys[1].charCodeAt(0));
			})
		};
	}
	componentDidMount() {
		const { updateAllPaths, socket, moves, meta } = this.props;
		if (socket) {
			updateAllPaths();
			const $movesFromViewerArray = moves.concatMap(a => a); // Observable.fromEvent(socket, 'moves');
			const $movesNormal = Observable.fromEvent(socket, 'move');
			const $moves = Observable.concat($movesFromViewerArray, $movesNormal);
			// const $meta = Rx.Observable.fromEvent(socket, 'meta');
			// const $chatMessages = Rx.Observable.fromEvent(socket, 'chatMessages');
			const $won = Observable.fromEvent(socket, 'won');
			const $stop = Observable.concat($won);
			this.subscription =
			$moves
			.takeUntil($stop)
				.subscribe(a => {
					console.log('observer', a);
					const { id, lastChecker } = a;
					this.moveHandle(id, lastChecker);
				});
		}
	}
	showMoves(id) {
		const piece = this.props.table[id];
		if (piece.checker * this.props.turn > 0 && piece.paths.length > 0)
			// console.log('Show move', piece.paths, id);
			this.props.showMoves(piece.paths, id);

	}
	moveHandle(id, lastChecker = this.props.lastChecker) {
		const { turn, socket, singlePlayer, move, updateAllPaths, setSide, hideMoves, showMoves } = this.props;
		lastChecker === this.props.lastChecker && !singlePlayer && socket.emit('move', { id, lastChecker, turn });
		const pieceTo = this.props.table[id];
		const piece = this.props.table[lastChecker];
		let consume;
		// debugger;
		if (piece.checker * turn > 0) {
			// console.log('Moved', id, piece, pieceTo, piece.paths);
			let paths = piece.paths.filter(path => {
				return path.points[0].id === pieceTo.id;
			});
			let path = paths[0];
			if (path.vectors.length > 0)
				consume = path.vectors[0].id;

			paths = paths.map(p => {
				return { ...p,
					points: p.points.slice(1),
					vectors: p.vectors.slice(1) };
			}).	filter(p =>
				p.points.length > 0);
			path = paths[0];
			const nextTurn = path && path.points.length > 0
				? turn
				: -turn;
			move(piece, pieceTo, consume, nextTurn);
			// console.log('Turnings', nextTurn, turn);
			if (nextTurn === turn) {
				// console.log('Show next move', paths, pieceTo.id);
				hideMoves();
				showMoves(paths, pieceTo.id);
			}
			else
				hideMoves();
			if (singlePlayer === true)
				setSide(nextTurn);
			updateAllPaths();
		}
	}
	render() {
		const { keysMap, letters } = this.state;
		const { boardSize } = this.props;
		return (
			<div className="checkers-table">
				<div className="numbers" style={{ fontSize: boardSize / 50 }}>
					{[...Array(Math.sqrt(keysMap.length * 2)).keys()].map(i => {
						return <span key={`n-${i}`} className={`number-${i + 1}`}>{i + 1}</span>;
					})}
				</div>
				<div className="letters" style={{ fontSize: boardSize / 50 }}>
					{[...Array(Math.sqrt(keysMap.length * 2)).keys()].map(i => {
						return <span key={`l-${i}`} className={`letter-${i + 1}`}>{letters[i]}</span>;
					})}
				</div>
				<div className="checkers-table" data-whites={this.props.turn}>
				{keysMap.map((a) => {
					return <Checker id={a} key={a} {...this.props.table[a]} hideMoves={this.props.hideMoves} showMoves={this.showMoves.bind(this)} move={this.moveHandle.bind(this)}/>;
				})}
				</div>
			</div>
		);
	}
}

const mapStateToProps = (store) => {
	const { table, turn, lastChecker } = store.game;
	return { table, turn, lastChecker };
};
const mapDispatchToProps = (dispatch, ownProps) => {
	return {
		hideMoves() {
			dispatch({ type: 'hideMoves' });
		},
		showMoves(paths, id) {
			dispatch({ type: 'showMoves', paths, id });
		},
		move(piece, pieceTo, consume, turn) {
			dispatch({ type: 'move', piece, pieceTo, consume, turn });
		},
		updateAllPaths() {
			dispatch({ type: 'updateAllPaths' });
		},
		setSide(side) {
			dispatch({ type: 'setSide', side });
		},
	};
};

export default connect(mapStateToProps, mapDispatchToProps)(CheckersTable);
