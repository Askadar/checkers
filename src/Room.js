const io = require('socket.io')();
module.exports = class Room {
	constructor(socket, data, id) {
		this.id = 'r' + id;
		this.users = [];
		this.players = [];
		this.moves = [];
		this.closed = false;
		this.type = data.type;
		this.time = data.time;
		// this.join(socket);
	}
	toString() {
		return this.id;
	}
	join(socket, player) {
		if (!this.closed) {
			this.users.push(socket);
			socket.join(this.id);
			socket.room = this;
			let side;
			// (Math.round(Math.random()) === 0 ? '-1' : '1'
			switch (this.players.length) {
			case 0: side = '1'; break;
			case 1: side = '-1'; break;
			default: side = 0;
			}
			this.players.length < 2 && this.players.push({ ...player, side });
			socket.emit('meta', { type: 'side', side });
			io.to(this.id).emit('meta', { type: 'players', players: this.players });
			this.moves.length > 0 && socket.emit('moves', this.moves);
			console.log('onJoin log', this);
		}
	}
	leave(socket) {
		if (this.players.some(p => p.id === socket.id)) {
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
		this.moves.push(move);
	}
};
