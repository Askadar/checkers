const io = require('socket.io')();
const port = process.env.PORT || 3000;
const uuid = require('uuid');
const AssocArray = require('./src/assocarray');
const { playHandler, enterHandler, moveHandler } = require('./src/handlers');

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
		playHandler(data, rooms, socket);
	});
	socket.on('enterRoom', data => {
		console.log('onEnterRoom Handler', socket.room, data);
		enterHandler(data, rooms, socket);
		// we always have room existing if we try this one (so no assholes could exploit router auto-entering and create countless rooms) ((though they still could try to exploit 'play' event))
	});
	socket.on('move', data => {
		moveHandler(data, rooms, socket);
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
