import React, { Component } from 'react';
import CheckersTable from './CheckersTable';
import Player from './Player';
import { connect } from 'react-redux';
import { Observable } from 'rxjs';
import WinScreen from './winscreen';
import locale from '../../config/locale';

class Match extends Component {
	constructor(p) {
		super(p);
		this.state = {
			// player options
			'$moves': null,
			side: 0,
			player: p.player,
			otherPlayer: { name: 'Opponent', rating: null },
			// room and board settings
			boardSize: (Math.min(window.innerHeight, window.innerWidth) * 8 / 10)
		};
	}
	componentWillMount() {
		console.log('match mounting');
		const { socket } = this.props;
		const roomId = this.props.routeParams.roomId ? this.props.routeParams.roomId : '-1';
		const $movesFromViewerArray = Observable.fromEvent(socket, 'moves').take(1);
		const $metaStream = Observable.fromEvent(socket, 'meta');

		const $resizeThrottled = Observable.fromEvent(window, 'resize').auditTime(350);
		this.resizeSubscriber = $resizeThrottled.subscribe(() => this.resizeBoard());

		this.metaStream = $metaStream.subscribe(a => {
			switch(a.type) {
			case 'side':
				this.setState({ side: a.side });
				this.props.setSide(a.side);
				this.props.updateAllPaths();
				break;
			case 'players':
				const { players } = a; let { side } = this.state;
				let player;
				if (+side === 0)
					side = 1;
				player = players[side];
				const otherPlayer = players[-side];
				this.setState({ player, otherPlayer: otherPlayer ? otherPlayer : this.state.otherPlayer });
				break;
			}
		});
		roomId !== '-1' && socket.emit('enterRoom', { id: roomId, player: this.props.user });
		this.setState({ '$moves': $movesFromViewerArray, '$meta': $metaStream });
		console.log('match set its own state at mounting');
	}
	componentDidMount() {
		console.log('match mounted');
	}
	componentWillReceiveProps(props) {
		props.won && props.socket.emit('won');
	}
	componentWillUnmount() {
		this.resizeSubscriber.unsubscribe();
		this.metaStream.unsubscribe();
	}
	resizeBoard() {
		const boardSize = (Math.min(window.innerHeight, window.innerWidth) * 8 / 10);
		this.setState({ boardSize });
	}
	render() {
		// console.log(this.props);
		const { $moves, $meta, player, otherPlayer, boardSize, side } = this.state;
		const { won, socket, turn, room, user } = this.props;
		return (
			<div data-roomId={room}>
			<p className="debug">multipleya {Object.keys(user).map(key => <span key={key}>{` ${key} = ${user[key]}`}</span>)}</p>
				<Player opponent={side !== 0} {...otherPlayer}/>
				<p>{`${locale.currentMove} ${locale[turn]}`}</p>
				<div className="checkers-table-container center-block" style={{
					height: boardSize,
					width: boardSize
				}}>
					<div className={won ? 'won' : ''}>
						<WinScreen {...won}/>
					</div>
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
