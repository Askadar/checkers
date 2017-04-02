class User {
	constructor(socket) {
		this.room = socket.room;
		this.uid = socket.uid;
		// this.updateSocket(socket);
	}
	// updateSocket(socket) {
	// 	this._socket = socket;
	// 	// this.emit = socket.emit;
	// 	// this.to = socket.to;
	// 	console.log('updated user to new socket: ', socket.id);
	// }
	// get broadcast() { return this._socket.broadcast; }
	// get socket() { return this._socket; }
	// get emit() { return this._socket.emit; }
}

module.exports = {
	User
};
