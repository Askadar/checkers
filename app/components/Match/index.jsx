import React, { Component } from 'react';
import CheckersTable from './CheckersTable';
import Player from './Player';
import { connect } from 'react-redux';
import { Observable } from 'rxjs';

class Match extends Component {
	constructor(p) {
		super(p);
		let player = { name: 'test' /* window.prompt('You\'re name?', 'Fixy')*/, rating: 2754 };
		this.state = {
			// player options
			'$moves': null,
			playerSide: 0,
			player,
			otherPlayer: { name: 'Opponent', rating: null },
			// room and board settings
			boardSize: (Math.min(window.innerHeight, window.innerWidth) * 8 / 10)
		};
	}
	componentWillMount() {
		console.log('mounting', this.props);
		const { player } = this.state;
		const { socket } = this.props;
		const roomId = this.props.routeParams.roomId ? this.props.routeParams.roomId : '-1';
		const $movesFromViewerArray = Observable.fromEvent(socket, 'moves');
		const $metaStream = Observable.fromEvent(socket, 'meta');

		const $resizeThrottled = Observable.fromEvent(window, 'resize').auditTime(350);
		this.resizeSubscriber = $resizeThrottled.subscribe(a => {console.log('resize event', a); this.resizeBoard();});

		$metaStream.subscribe(a => {
			switch(a.type) {
			case 'side':
				// const player = a.players.find(pl => pl.side === a.side);
				this.setState({ playerSide: a.side, player: { ...player, side: a.side } });
				this.props.setSide(a.side);
				this.props.updateAllPaths();
				break;
			case 'players':
				const otherPlayer = a.players.find(pl => pl.side !== this.state.playerSide);
				this.setState({ otherPlayer });
				break;
			}
		});
		roomId !== '-1' && socket.emit('enterRoom', { id: roomId, player });
		this.setState({ '$moves': $movesFromViewerArray, '$meta': $metaStream });
	}
	componentWillUnount() {
		this.resizeSubscriber.unsubscribe();
	}
	resizeBoard() {
		const boardSize = (Math.min(window.innerHeight, window.innerWidth) * 8 / 10);
		this.setState({ boardSize });
	}
	render() {
		console.log(this.props);
		const { $moves, $meta, player, otherPlayer, boardSize } = this.state;
		const { won, socket, turn } = this.props;
		return (
			<div>
				<Player {...otherPlayer}/>
				<p>{`Сейчас ход ${turn === 1
						? 'белых'
						: 'черных'}.`}</p>
				<div className="checkers-table-container center-block" style={{
					height: boardSize,
					width: boardSize
				}}>
					<div className={won ? 'won' : ''}><WinScreen {...won}/></div>
					<CheckersTable boardSize={boardSize} socket={socket} moves={$moves} meta={$meta}/>
				</div>
				<Player {...player}/>
			</div>
		);
	}
}

export default connect((s) => {
	return { turn: s.game.turn, won: s.game.won };
}, (dispatch) => {
	return {
		setSide(side) {	dispatch({ type: 'setSide', side }); },
		updateAllPaths() { dispatch({ type: 'updateAllPaths' }); }
	};
})(Match);

const WinScreen = ({ type, side, message }) => {
	return (<div className="game-result">
		<span className="side">{side === 1 ? 'white' : 'black'}</span>
		<span className="type">{type}</span>
		<span className="message">{message}</span>
	</div>);
};
