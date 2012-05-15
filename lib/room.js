module.exports = (function() {
	var io = require('./io');

	var Room = function(id, players, sockets) {
		this.id = id;

		sockets[0].join(this.id);
		sockets[1].join(this.id);


		this._roomSocket = io.sockets.to(this.id);

		console.log(this._roomSocket)

		sockets[0]
			.on('mv', function(e) {
				console.log(this._roomSocket)
				sockets[0]
					.emit('move', {
						me				: true,
						direction	: e.direction
					});
				sockets[1]
					.emit('move', {
						me				: false,
						direction	: e.direction
					});
			}.bind(this));

		sockets[1]
			.on('mv', function(e) {
				sockets[0]
					.emit('move', {
						me				: false,
						direction	: e.direction
					});
				sockets[1]
					.emit('move', {
						me				: true,
						direction	: e.direction
					});
			}.bind(this));

		// this._roomSocket.on('mv', function(e) {console.log('asdasdsdassadads')})
	};

	// Room.prototype 

	return Room;

})();