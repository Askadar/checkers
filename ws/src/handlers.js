const Room = require('./Room');

function playHandler(data, store, emitter) {

	const filteredRooms = store.filter(room => {
		return room.players.length < 2 &&
			room.type === data.type &&
			room.time === data.time;
	});
	console.log('play after filter', filteredRooms, store);
	if (filteredRooms.length > 0) {
		const id = Math.random() * (filteredRooms.length - 1);
		emitter.emit('roomCreated', filteredRooms[id].toString());
	}
	else
		// check if this emitter (preferably ip) doesn't just spam server and let it create room
		if (!emitter.room) {
			const id = store.create(new Room(emitter, data, store.counter));
			emitter.emit('roomCreated', id);
		}
}

function enterHandler(data, store, emitter) {
	if (store[data.id])
		store[data.id].join(emitter, data.player);
	else
		emitter.emit('err', { type: 'No room with such id' });
}

function moveHandler(data, store, emitter) {
	console.log(data);
	emitter.room.pushMove(data);
	emitter.to(emitter.room).emit('move', data);
}

function wonHandler() {

}

module.exports = { playHandler, enterHandler, moveHandler, wonHandler };
