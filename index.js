// Setup basic express server
// var express = require('express');
// var app = express();
// var server = require('http').createServer(app);
var io = require('socket.io')();
var port = process.env.PORT || 3000;
var uid = require('uid-safe');
var uuid = require('uuid');
class Room {
	constructor(){
		this.id = uuid.v4();
		this.users = [];
	}
	toString(){
		return this.id;
	}
}

var rooms = []; //holds all active rooms ids or maybe room objects

io.on('connection', function (socket) {
	//setInterval(()=>socket.emit('move','testing stuff'), 1000);
	socket.uid = uuid.v4();
	socket.on('enterRoom', data =>{
		if (rooms.some(room => room == data.id)){ //we have room already, we use just object cause rooms have overwritten toString method
			rooms[data.id].join(socket)
		}
	})
  socket.on('move', data => {
    console.log(data);
    socket.broadcast.emit('move',data);
  })
});

io.listen(port);
