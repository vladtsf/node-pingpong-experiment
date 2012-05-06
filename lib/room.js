module.exports = (function() {
	var io = require('./io');

	var Room = function(id, players, sockets) {
		this.id = id;

		sockets[0].join(this.id);
		sockets[1].join(this.id);


		this._roomSocket = io.sockets.in(this.id);
	};

	// Room.prototype 

	return Room;

})();