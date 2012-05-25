module.exports = (function() {
	var io = require('./io');
	var Ball = require ('../lib/ball.js');

	var Room = function(id, players, sockets) {
		this.id = id;
		this.ball = new Ball();
		console.log(this.ball);
		this.sockets = sockets;

		sockets[0].join(this.id);
		sockets[1].join(this.id);

		players[0].position = 0;
		players[1].position = 0;
		players[0].score = 0;
		players[1].score = 0;
		this.players = players;
		
		

		var _sentPositions = [0, 0]

		sockets[0]
			.on('srv_sync_position', function(e) {
				players[0].position = e.position;
			})
			.on('checkGoal', function(e) {
				this.players[0].position = e;				
				this.checkGoal();
			}.bind(this));

		sockets[1]
			.on('srv_sync_position', function(e) {
				players[1].position = 350 - 60 - e.position;
			})
			.on('checkGoal', function(e) {
				this.players[1].position = 350 - 60 - e;
				this.checkGoal();
			}.bind(this));

		this._syncInterval = setInterval(
			function() {
				if(_sentPositions[0] - players[0].position != 0) {
					_sentPositions[0] = players[0].position;

					sockets[1]
						.emit('cl_sync_position', {
							position	: 350 - 60 - players[0].position
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
		
		this.nextTrac();
	};

	 Room.prototype = {
		 checkGoal:function(){
		 	 var bc = (this.ball.pos.x+8);
		 	 if (this.ball.pos.y >= this.ball.rect.max.y){
			 	if (
			 		(this.players[0].position>bc)||
			 		((this.players[0].position+60)<bc)
			 	){
					this.players[1].score +=1;		
					this.ball.realspd = 0.2;
		 	 	} else {
					if(bc - this.players[0].position > 30) {
						//стукнулось в правую часть
						if (this.ball.spd.x < 0){
							this.ball.spd.x *=-1;
						}
					} else {
						//стукнулось в левую часть
						if (this.ball.spd.x > 0){
							this.ball.spd.x *=-1;
						}
					}
		 	 	}
		 	 }
		 	 if (this.ball.pos.y <= this.ball.rect.min.y){
		 	 	 if (
			 		(this.players[1].position>bc)||
			 		((this.players[1].position+60)<bc)
			 	 ){
				 	 this.players[0].score +=1;
				 	 this.ball.realspd = 0.2;
				 } else {
					if(bc - this.players[1].position > 30) {
						//стукнулось в правую часть
						if (this.ball.spd.x < 0){
							this.ball.spd.x *=-1;
						}
					} else {
						//стукнулось в левую часть
						if (this.ball.spd.x > 0){
							this.ball.spd.x *=-1;
						}
					}
		 	 	}
		 	 }
		 	 this.ball.realspd *= 1.05;
		 	 this.sockets[0].emit('score',{'pl0':this.players[0].score,'pl1':this.players[1].score});
		 	 this.sockets[1].emit('score',{'pl0':this.players[0].score,'pl1':this.players[1].score});
		 	 this.ball.boundY();		 	
		 	 this.nextTrac();
		 },
		 nextTrac:function(){
		 	this.trac0 = this.ball.newRoute();
		 	
			this.sockets[0].emit('newTrack',this.trac0);
			this.trac1 = [];
			this.trac0.forEach(function(data,ind){
				var dt={};
				dt.x = this.ball.rect.max.x - data.x;
				dt.y = this.ball.rect.min.y + this.ball.rect.max.y - data.y;
				dt.time = data.time;				
				this.trac1[ind] = dt;				
			}.bind(this))
			this.sockets[1].emit('newTrack',this.trac1);
		 }
	 }

	return Room;

})();