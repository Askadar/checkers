const io = require('socket.io')();
const port = process.env.PORT || 3000;
const uuid = require('uuid');
const { Rooms, AssocArray } = require('./src/AssocArray');
const { playHandler, enterHandler, moveHandler } = require('./src/handlers');
const { User } = require('./src/User');

let rooms = new Rooms(); // holds all active rooms ids or maybe room objects
let users = new AssocArray();

io.on('connection', socket => {
	socket.emit('matches', rooms.toTransferenceProtocol());
	// console.log('socket\'s request prop', socket.handshake.query.uid);
	let user;
	console.log('users', users.map(u => u.uid));
	console.log('connected', socket.handshake.query.uid);
	if(socket.handshake.query.uid)
		user = users.find(u => u.uid === socket.handshake.query.uid);
	if (user) {
		socket.uid = socket.handshake.query.uid;
		// user.updateSocket(socket);
		socket.user = user;
	}
	else {
		socket.uid = uuid.v4();
		socket.emit('uid', socket.uid);
		socket.user = new User(socket);
		users.push(socket.user);
	}

	socket.on('disconnect', () => {
		// console.log('disconnected', socket.id, socket.room);
		//	TODO  socket.user.scheduleCleanup
	});

	socket.on('play', data => {
		// console.log('play', data);
		// playHandler return true if room was successfully created;
		playHandler(data, rooms, socket) && io.emit('matches', rooms.toTransferenceProtocol());
	});
	socket.on('enterRoom', data => {
		// console.log('onEnterRoom Handler', socket.room, data);
		enterHandler(data, rooms, socket);
		io.emit('matches', rooms.toTransferenceProtocol());
		// we always have room existing if we try this one (so no assholes could exploit router auto-entering and create countless rooms) ((though they still could try to exploit 'play' event))
	});
	socket.on('requestMatches', () => {
		// console.log('onRequestMatches Handler', socket.room);
		socket.emit('matches', rooms.toTransferenceProtocol());
	});
	socket.on('move', data => {
		moveHandler(data, rooms, socket);
	});
	socket.on('won', data => {
		socket.user.room.close(data, socket);
		socket.emit('matches', rooms.toTransferenceProtocol());
	});
});
setInterval(() => io.emit('matches', rooms.toTransferenceProtocol()), 120 * 1000);

io.set('origins', '*askadar.github.io*:*, *v-damki.com*:*, *');
io.listen(port);
console.log('listening on port', port);
