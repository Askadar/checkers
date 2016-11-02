const io = require('socket.io')();
const port = process.env.PORT || 3000;
const uuid = require('uuid');
class Room {
	constructor(socket, data) {
		let debugUid = data.id || uuid.v4();
		this.id = debugUid;
		this.users = [];
		this.players = [];
		this.moves = [];
		this.closed = false;
		this.join(socket, data.player);
	}
	toString() {
		return this.id;
	}
	join(socket, player) {
		if (!this.closed) {
			this.users.push(socket);
			socket.join(this.id);
			socket.room = this;
			const side = this.players.length === 0 ? (Math.round(Math.random()) === 0 ? '-1' : '1') : -this.players[0].side;
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

	}
	pushMove(move) {
		this.moves.push(move);
	}
}

const rooms = {}; // holds all active rooms ids or maybe room objects

io.on('connection', socket => {
	// setInterval(()=>socket.emit('move','testing stuff'), 1000);
	socket.uid = uuid.v4();
	socket.on('reconnect', nr => {
		console.log('reconnected, nr: ', nr);
	});
	// disconnect event
	socket.on('disconnect', () => {
		console.log('disconnected', socket.id, rooms, socket.room);
		//	socket.room.leave(socket);
	});
	socket.on('enterRoom', data => {
		console.log('onEnterRoom Handler', socket.room, data);
		if (socket.room && rooms[socket.room]) { // we have room already, we use just object cause rooms have overwritten toString method
		}
		else if(data && data.id) {
			// let index = -1;
			if(rooms[data.id]) {
				rooms[data.id].join(socket, data.player);
			}
			else{
				rooms[data.id] = new Room(socket, data);
			}
		}
		else{
			rooms[data.id] = new Room(socket, data);
		}
	});
	socket.on('move', data => {
		console.log(data);
		socket.room.pushMove(data);
		socket.broadcast.emit('move', data);
	});
});

io.on('reconnect', nr => {
	console.log('io reconnected, nr: ', nr);
});
// disconnect event
io.on('disconnect', () => {
	console.log('io disconnected');
});
// setInterval(()=>console.log(rooms),5000)
io.set('origins', '*askadar.github.io*:*');
io.listen(port);
console.log('listening on port', port);
