const io = require('socket.io')();
module.exports = class Room {
	constructor(socket, data, id) {
		this.id = 'r' + id;
		this.users = [];
		this.players = {};
		this.moves = [];
		this.closed = false;
		this.type = data.type;
		this.time = data.time;
		// this.join(socket);
	}
	get full() {
		return this.players[1] && this.players[-1];
	}
	toString() {
		return this.id;
	}
	join(socket, player) {
		if (!this.closed) {
			socket.join(this.id);
			let { players } = this;

			let side;
			// (Math.round(Math.random()) === 0 ? '-1' : '1'
			if (!players[1]) {
				side = 1;
				this.firstPlayerSocket = socket;
			}
			else if(!players[-1])
				side = -1;
			else
				side = 0;
			if (socket.user.playingAs && socket.user.playingAs !== 0 && this.users.filter(user => user.uid === socket.user.uid).length > 0)
				side = socket.user.playingAs;
			else{
				if (side !== 0)
					socket.user.playingAs = side;
				this.users.push(socket.user);
			}
			if (!players[1] || !players[-1]) {
				players[side] = { ...player, side };
				socket.user.room = this;
			}
			socket.emit('meta', { type: 'side', side });
			// socket.emit('meta', { type: 'players', players });
			socket.emit('meta', { type: 'players', players });
			if (players[-1])
				this.firstPlayerSocket.emit('meta', { type: 'players', players });
				// socket.broadcast.emit('meta', { type: 'players', players });
			socket.emit('moves', this.moves);
			// console.log('onJoin log', this);
		}
	}
	leave(socket) {
		if (this.players[1] === socket || this.players[-1] === socket) {
			// TODO: wait for them to reconnect and don't throw around users array
		}
		this.users = this.users.filter(u => u.id !== socket.id);
		console.log('missin playas', this.users);
	}
	close(data) {
		if (!this.closed) {
			io.to(this.id).emit('won', data);
			this.closed = true;
		}
	}
	pushMove(move) {
		// console.log(this.moves);
		this.moves.push(move);
	}
};
