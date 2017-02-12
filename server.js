var express = require('express');
var path = require('path');

var app = express();

app.use(express.static(path.join(__dirname,'./static')));

app.set('view engine','ejs');
app.set('views',path.join(__dirname,'./views'));

app.get('/', function (request, response){
	response.render('index');
});

var server = app.listen(6789);
var io = require('socket.io').listen(server);
var players = [];

io.sockets.on('connection', function (socket){
	// console.log(socket.id);
	socket.on('new_user', function (data){
		if (players.length < 2){
			players.push({number: players.length, name: data.name, score: 0});
			socket.emit('wait', {number: players[players.length-1].number});
			console.log(players);
		}
		if (players.length == 2){
			io.emit('game_ready', {players: players});
			console.log(players);
		}
	});
	console.log(players.length);
	socket.on('update_score', function (data){
		// console.log(data);
		// players[data.name] += data.score;
		// socket.broadcast.emit('new_score', {name: data.name, score: players[data.name]});
	});

});