const Room = require('./Room');

function playHandler(data, store, emitter) {
		// check if this emitter (preferably ip) doesn't just spam server and let it create room
	if (!emitter.user.room || emitter.user.room.closed) {
		const appliableRooms = store.filter(room => {
			return !room.full &&
				room.type === data.type &&
				room.time === data.time;
		});
		console.log('[play] filtered rooms and whole store', appliableRooms, store);
		if (appliableRooms.length > 0) {
			const id = Math.random() * (appliableRooms.length - 1);
			emitter.emit('roomCreated', appliableRooms[id].toString());
		}
		else {
			const id = store.create(new Room(emitter, data, store.counter));
			emitter.emit('roomCreated', id);
		}
		return true;
	}
	emitter.emit('alreadyPlaying', emitter.user.room.id);
	return false;
}

function enterHandler(data, store, emitter) {
	if (store[data.id])
		store[data.id].join(emitter, data.player);
	else
		emitter.emit('wrongRoom');
}

function moveHandler(data, store, emitter) {
	console.log('trying to move', data, emitter.user);
	if (+emitter.user.playingAs === +data.turn) {
		emitter.user.room.pushMove(data);
		emitter.to(emitter.user.room).emit('move', data);
	}
}

function wonHandler() {
	// TODO close room and remove it from listing, (save to db?)
}
function pingHandler() {
	// TODO ping-pong da shiet out of socket
}

module.exports = { playHandler, enterHandler, moveHandler, wonHandler };
