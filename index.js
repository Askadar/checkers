// Setup basic express server
// var express = require('express');
// var app = express();
// var server = require('http').createServer(app);
"use strict";

var io = require('socket.io')();
var port = process.env.PORT || 3000;
var uid = require('uid-safe');
var uuid = require('uuid');
class Room {
	constructor(socket, debugUid = uuid.v4()){
		this.id = debugUid;
		this.users = [];
		this.playing = [];
		this.moves = [];
		this.join(socket);
	}
	toString(){
		return this.id;
	}
	join(socket){
		this.users.push(socket);
		this.playing.length < 2 && this.playing.push(socket);
		socket.join(this.id);
		socket.room = this;
		socket.emit('meta','successfully joined room'+this)
		socket.emit('moves', this.moves);
		console.log('onJoin log',this);
	}
	leave(socket){
		if (this.players.some(p=>p.id == socket.id)){
			// TODO: wait for them to reconnect and don't throw around users array
		}
		this.users = this.users.filter(u=>u.id != socket.id);

	}
	pushMove(move){
		this.moves.push(move);
	}
}

var rooms = []; //holds all active rooms ids or maybe room objects

io.on('connection', function (socket) {
	//setInterval(()=>socket.emit('move','testing stuff'), 1000);
	socket.uid = uuid.v4();
	socket.on('reconnect', function (nr) {
	    console.log('reconnected, nr: ', nr);
	});
	//disconnect event
	socket.on('disconnect', function () {
	    console.log('disconnected', socket.id, rooms, socket.room);
		//	socket.room.leave(socket);
	});
	socket.on('enterRoom', data =>{
		console.log('onEnterRoom Handler', rooms, socket.room, data);
		if (socket.room && rooms[socket.room]){ //we have room already, we use just object cause rooms have overwritten toString method
		}
		else {
			if(data && data.id){
				let index = -1;
				if(rooms.some((room, i) => {index = i; return room == data.id})){
					rooms[index].join(socket);
				}
				else
					rooms.push(new Room(socket, data.id));
			}
			else{
				rooms.push(new Room(socket));
			}
		}
	})
  socket.on('move', data => {
    console.log(data);
		socket.room.pushMove(data);
    socket.broadcast.emit('move',data);
  })
});


io.on('reconnect', function (nr) {
		console.log('io reconnected, nr: ', nr);
});
//disconnect event
io.on('disconnect', function () {
		console.log('io disconnected');
});
//setInterval(()=>console.log(rooms),5000)
io.listen(port);
console.log('listening on port', port);
