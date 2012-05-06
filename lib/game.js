module.exports = (function() {
	var
		io = require('./io'),
		md5 = require('MD5'),
		sessions = require('./session'),
		parseCookie = require('connect').utils.parseCookie,
		Room = require('./room');

	var Game = {
		players: {},
		sockets: {},
		playersCount: 0,
		rooms: {}
	};

	var ws = io
		.of('/ws/')
		.on('connection', function (socket) {
			var cookie = parseCookie(socket.handshake.headers.cookie);

			sessions.get(cookie.sid, function (err, session) {
				if (session && session.user) {
					var
						user = session.user;

					if(!Game.players[user._id]) {
						Game.playersCount++;
					}

					var
						player = Game.players[user._id] = {
							login : user.login,
							score : user.score || 0,
							id : user._id,
							waiting	: true
						};

					Game.sockets[user._id] = socket;

					socket
						.on('disconnect', function() {
							socket.broadcast.emit('player_leave', player);
							Game.playersCount--;
							delete Game.players[user._id];
							delete Game.sockets[user._id];
						})
						.on('invite', function(e) {
							if(Game.players[e.opponent] && Game.players[e.me]) {
								Game.sockets[e.opponent].emit('invitation', Game.players[e.me]);
							}
						})
						.on('invitation_reply', function(e) {
							if(e.answer && Game.players[e.to]) {
								Game.players[e.to].waiting = false;
								Game.players[player.id].waiting = false;

								var roomName = md5(e.me + player.id);
								Game.sockets[player.id].emit('goto_room', roomName);
								Game.sockets[e.to].emit('goto_room', roomName);
								Game.rooms[roomName] = new Room(roomName, [Game.players[e.to], Game.players[player.id]], [Game.sockets[player.id], Game.sockets[e.to]])
							}
						});

					socket.broadcast.emit('player_join', player);
				}
			});

		});


	return Game;
})();