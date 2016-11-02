import React from 'react';
import CheckersTable from './CheckersTable';
import Player from './Player';
import { connect } from 'react-redux';
import io from 'socket.io-client';
import { Rx, Observable } from 'rxjs';

class Match extends React.Component {
	constructor(p) {
		super(p);
		const debug = true;
		let player = { name: window.prompt('You\'re name?', 'Fixy'), rating: 2754 };
		this.state = {
			// socket options
			socketPath: debug ? 'http://localhost:3000' : 'https://websockety-askadar.c9users.io:8080/',
			socketOptions: {
				reconnection: true,
				reconnectionDelay: 500,
				reconnectionAttempts: 10
			},
			// player options
			'$moves': null,
			playerSide: 0,
			player,
			otherPlayer: { name: 'Your enemy', rating: '?' },
			// room and board settings
			roomId: this.props.routeParams ? this.props.routeParams : '-1',
			boardSize: (Math.min(window.innerHeight, window.innerWidth) * 8 / 10)
		};
	}
	componentWillMount() {
		const { socketPath, socketOptions, player } = this.state;
		const socket = io(socketPath, socketOptions);
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
		this.state.roomId !== '-1' && socket.emit('enterRoom', { id: this.state.roomId, player });
		this.setState({ socket, '$moves': $movesFromViewerArray, '$meta': $metaStream });
	}
	componentWillUnount() {
		this.resizeSubscriber.unsubscribe();
	}
	resizeBoard() {
		const boardSize = (Math.min(window.innerHeight, window.innerWidth) * 8 / 10);
		this.setState({ boardSize });
	}
	render() {
		const { socket, $moves, $meta, player, otherPlayer, boardSize } = this.state;
		return (
			<div>
				<Player {...otherPlayer}/>
				<p>{`Сейчас ход ${this.props.turn === 1
						? 'белых'
						: 'черных'}.`}</p>
				<div className="checkers-table-container center-block" style={{
					height: boardSize,
					width: boardSize
				}}>
					<CheckersTable socket={socket} moves={$moves} meta={$meta}/>
				</div>
				<Player {...player}/>
			</div>
		);
	}
}

export default connect((s) => {
	return { turn: s.game.turn };
}, (dispatch) => {
	return {
		setSide(side) {	dispatch({ type: 'setSide', side }); },
		updateAllPaths() { dispatch({ type: 'updateAllPaths' }); }
	};
})(Match);
