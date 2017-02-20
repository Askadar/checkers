const Room = require('./Room');

function playHandler(data, store, emitter) {

	const appliableRooms = store.filter(room => {
		return room.players.length < 2 &&
			room.type === data.type &&
			room.time === data.time;
	});
	console.log('[play] filtered rooms and whole store', appliableRooms, store);
	if (appliableRooms.length > 0) {
		const id = Math.random() * (appliableRooms.length - 1);
		emitter.emit('roomCreated', appliableRooms[id].toString());
	}
	else
		// check if this emitter (preferably ip) doesn't just spam server and let it create room
		if (!emitter.room) {
			const id = store.create(new Room(emitter, data, store.counter));
			emitter.broadcast.emit('matches', store.toTransferenceProtocol());
			emitter.emit('roomCreated', id);
		}
}

function enterHandler(data, store, emitter) {
	if (store[data.id])
		store[data.id].join(emitter, data.player);
	else
		emitter.emit('wrongRoom');
}

function moveHandler(data, store, emitter) {
	console.log('moving', data, emitter && emitter.id);
	emitter.room.pushMove(data);
	emitter.to(emitter.room).emit('move', data);
}

function wonHandler() {
	// TODO close room and remove it from listing, (save to db?)
}
function pingHandler() {
	// TODO ping-pong da shiet out of socket
}

module.exports = { playHandler, enterHandler, moveHandler, wonHandler };
