import React, { Component } from 'react';
import CheckersTable from './CheckersTable';
import { connect } from 'react-redux';
import { Observable } from 'rxjs';
import WinScreen from './winscreen';
import locale from '../../config/locale';

class SinglePlayerMatch extends Component {
	constructor(p) {
		super(p);
		let player = { name: 'You' /* window.prompt('You\'re name?', 'Fixy')*/, rating: null, side: 1 };
		this.state = {
			// player options
			playerSide: 0,
			player,
			otherPlayer: { name: 'You too', rating: null, side: -1 },
			// room and board settings
			boardSize: (Math.min(window.innerHeight, window.innerWidth) * 8 / 10)
		};
	}
	componentWillMount() {
		this.resetBoard();
		// this.props.setSide(1);
		// this.props.updateAllPaths();
		const $resizeThrottled = Observable.fromEvent(window, 'resize').auditTime(350);
		this.resizeSubscriber = $resizeThrottled.subscribe(() => this.resizeBoard());
	}
	componentWillUnount() {
		this.resizeSubscriber.unsubscribe();
	}
	resizeBoard() {
		const boardSize = (Math.min(window.innerHeight, window.innerWidth) * 8 / 10);
		this.setState({ boardSize });
	}
	resetBoard() {
		const { resetBoard, setSide, updateAllPaths } = this.props;
		resetBoard();
		setSide(1);
		updateAllPaths();
	}
	render() {
		console.log(this.props);
		const { boardSize } = this.state;
		const { won, turn } = this.props;
		return (
			<div>
				{/* <Player {...otherPlayer}/> */}
				<p><button onClick={this.resetBoard.bind(this)} className="butt" >{locale.resetSinglePlayerBoard}</button></p>
				<p>{`${locale.currentMove} ${locale[turn]}`}</p>
				<div className="checkers-table-container center-block" style={{
					height: boardSize,
					width: boardSize
				}}>
					<div className={won ? 'won' : ''}>
						<WinScreen {...won}/>
					</div>
					<CheckersTable boardSize={boardSize} turn={turn} singlePlayer/>
				</div>
				{/* <Player {...player}/> */}
			</div>
		);
	}
}

export default connect((s) => {
	return { turn: s.game.turn, won: s.game.won };
}, (dispatch) => {
	return {
		updateAllPaths() {
			dispatch({ type: 'updateAllPaths' });
		},
		setSide(side) {
			dispatch({ type: 'setSide', side });
		},
		resetBoard() {
			dispatch({ type: 'resetBoard' });
		}
	};
})(SinglePlayerMatch);
