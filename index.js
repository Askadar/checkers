const io = require('socket.io')();
const port = process.env.PORT || 3000;
const uuid = require('uuid');
const AssocArray = require('./src/assocarray');
const Room = require('./src/room');

let rooms = new AssocArray(); // holds all active rooms ids or maybe room objects

io.on('connection', socket => {
	// setInterval(()=>socket.emit('move','testing stuff'), 1000);
	socket.uid = uuid.v4();
	socket.on('reconnect', nr => {
		console.log('reconnected, nr: ', nr);
	});
	// disconnect event
	socket.on('disconnect', () => {
		console.log('disconnected', socket.id, socket.room);
		//	socket.room.leave(socket);
	});
	socket.on('play', data => {
		// console.log('play', data);
		const filteredRooms = rooms.filter(room => {
			return room.players.length === 1 &&
				room.type === data.type &&
				room.time === data.time
			;
		});
		console.log('play after filter', filteredRooms, rooms);
		if (filteredRooms.length > 0) {
			const id = Math.random() * (filteredRooms.length - 1);
			socket.emit('roomCreated', filteredRooms[id].toString());
		}
		else
			// check if this socket (preferably ip) doesn't just spam server and let it create room
			if (!socket.room) {
				const id = rooms.create(new Room(socket, data, rooms.counter));
				socket.emit('roomCreated', id);
			}
	});
	socket.on('enterRoom', data => {
		console.log('onEnterRoom Handler', socket.room, data);
		// we always have room existing if we try this one (so no assholes could exploit router auto-entering and create countless rooms) ((though they still could try to exploit 'play' event))
		if (rooms[data.id])
			rooms[data.id].join(socket, data.player);
		else
			socket.emit('err', { type: 'No room with such id' });
	});
	socket.on('move', data => {
		console.log(data);
		socket.room.pushMove(data);
		socket.to(socket.room).emit('move', data);
	});
	socket.on('won', data => {
		socket.room.close(data);
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
