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
		let player = window.confirm('you\'re fixy?') ? { name: 'Fixy', rating: 2754 } : { name: 'Zixy', rating: 2787 };
		this.state = {
			socketPath: debug ? 'http://localhost:3000' : 'https://websockety-askadar.c9users.io:8080/',
			socketOptions: {
				reconnection: true,
				reconnectionDelay: 500,
				reconnectionAttempts: 10
			},
			'$moves': null,
			playerSide: 0,
			player,
			otherPlayer: {}
		};
	}
	componentWillMount() {
		const { socketPath, socketOptions, player } = this.state;
		const socket = io(socketPath, socketOptions);
		const $movesFromViewerArray = Observable.fromEvent(socket, 'moves');
		const $metaStream = Observable.fromEvent(socket, 'meta');
		$metaStream.subscribe(a => {
			switch(a.type) {
			case 'side':
				// const player = a.players.find(pl => pl.side === a.side);
				this.setState({ playerSide: a.side, player: { ...player, side: a.side } });
				this.props.setSide(a.side);
				this.props.updateAllPaths();
				break;
			case 'players':
				const otherPlayer = a.players.find(pl => pl.side !== a.side);
				this.setState({ otherPlayer });
				break;
			}
		});
		socket.emit('enterRoom', { id: this.props.routeParams.roomId, player });
		this.setState({ socket, '$moves': $movesFromViewerArray, '$meta': $metaStream });
	}
	render() {
		const { socket, $moves, $meta, player, otherPlayer, playerSide } = this.state;
		const smallerSize = Math.min(window.innerHeight, window.innerWidth);
		return (
			<div>
				<Player {...otherPlayer}/>
				<p>{`Сейчас ход ${this.props.turn === 1
						? 'белых'
						: 'черных'}.`}</p>
				<div className="checkers-table-container center-block" style={{
					height: (smallerSize * 3 / 4) + 64,
					width: (smallerSize * 3 / 4) + 64
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
