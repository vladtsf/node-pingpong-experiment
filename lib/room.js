module.exports = (function() {
	var io = require('./io');

	var Room = function(id, players, sockets) {
		this.id = id;

		sockets[0].join(this.id);
		sockets[1].join(this.id);

		players[0].position = 0;
		players[1].position = 0;

		var _sentPositions = [0, 0]

		sockets[0]
			.on('srv_sync_position', function(e) {
				players[0].position = e.position;
			});

		sockets[1]
			.on('srv_sync_position', function(e) {
				players[1].position = e.position;
			});

		this._syncInterval = setInterval(
			function() {
				if(_sentPositions[0] - players[0].position != 0) {
					_sentPositions[0] = players[0].position;

					sockets[1]
						.emit('cl_sync_position', {
							position	: players[0].position
						});
				}
				
				if(_sentPositions[1] - players[1].position != 0) {
					_sentPositions[1] = players[1].position;
					
					sockets[0]
						.emit('cl_sync_position', {
							position	: players[1].position
						});
				}
			}
		, 60);
	};

	// Room.prototype 

	return Room;

})();