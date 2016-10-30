import React from 'react';
import CheckersTable from './CheckersTable'
import {connect} from 'react-redux';
import io from 'socket.io-client';
import {Rx, Observable} from 'rxjs';

class Match extends React.Component {
	constructor(p){
		super(p);
		let debug = false;
		this.state = {
			socketPath: debug ? 'http://localhost:3000': 'https://websockety-askadar.c9users.io:8080/',
			socketOptions: {
				reconnection: true,
				reconnectionDelay: 500,
				reconnectionAttempts: 10
			},
			moves:null
		}
	}
	componentWillMount(){
		const {socketPath, socketOptions} = this.state;
		let socket = io(socketPath, socketOptions);
		const $movesFromViewerArray = Observable.fromEvent(socket,'moves')
		// socket.on('moves', data => {
		// 	console.log('onMoves event',this);
		// 	this.setState({moves: $movesFromViewerArray});
		// })
		socket.emit('enterRoom', {id:'56040d8e-c6f2-4780-af11-d42d43a1be42'});
		this.setState({socket, moves: $movesFromViewerArray})
	}
	render() {
		let smallerSize = Math.min(window.innerHeight, window.innerWidth)
		return (
			<div>
				<p>{`Играют ${this.props.routeParams.firstPlayer} и ${this.props.routeParams.secondPlayer}`}</p>
				<p>{`Сейчас ход ${this.props.turn == 1
						? 'белых'
						: 'черных'}.`}</p>
				<div className="checkers-table-container center-block" style={{
					height: (smallerSize * 3 / 4) + 64,
					width: (smallerSize * 3 / 4) + 64
				}}>
					<CheckersTable socket={this.state.socket} moves={this.state.moves}/>
				</div>
			</div>
		)
	}
};

export default connect((s) => {
	return {turn: s.game.turn}
})(Match)
