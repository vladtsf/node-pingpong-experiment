module.exports = (function() {
	
	var Ball = function() {
		this.pos = {x:100,y:100};
		this.spd= {x:8,y:13};
		this.realspd = 0.15;
		this.rect={
			min:{x:0,y:16},
			max:{x:330,y:364}
		};
	};
	
	
	Ball.prototype = {
	
		init:	function() {
			this.pos = {
				x	: 175,
				y	: 200
			};
			this.spd = {
				x	: ((Math.random() * 1000) % 2 ? -1 : 1) * (((Math.random() * 1000) % 10) + 5),
				y	: ((Math.random() * 1000) % 2 ? -1 : 1) * (((Math.random() * 1000) % 10) + 5)
			};
			
			return this;
		},
	
		checkcross:	function() {
			var c = this.spd.y*this.pos.y - this.spd.x*this.pos.x;		
			var y = this.rect.min.y;

			if (this.spd.y>0){
				y = this.rect.max.y;
			}		

			var x = ( y * this.spd.y - c) / this.spd.x;
			if ((x<this.rect.min.x)||(x>this.rect.max.x)){
				x = this.rect.max.x;
				if ( this.spd.x < 0 ){
					x = this.rect.min.x;
				}
				y = ( x * this.spd.x + c) / this.spd.y
			}
			return {"x":x,"y":y};    
		},
		
		
		boundY:	function() {
			if ((this.pos.y <= this.rect.min.y)||(this.pos.y >= this.rect.max.y)){
				this.spd.y *= -1;
			}
			
			return this;
		},
		
		boundX:	function() {
			if ((this.pos.x >= this.rect.max.x)||(this.pos.x <= this.rect.min.x)){
				this.spd.x *= -1;
			}
			
			return this;
		},
		
		dist: function (pos1, pos2){
			var dx = pos2.x-pos1.x,
				dy = pos2.y-pos1.y,
				reslt = Math.sqrt((dx*dx) + (dy*dy));
				return reslt;
		},
		
		calctime:	function(pos1, pos2) {
			return Math.round(this.dist(pos1, pos2)/this.realspd);
		},
		
		
		newRoute:	function() {
			var limit = this.rect.min.y;
			if (this.spd.y>0){
				limit = this.rect.max.y;
			}
			var route=[];
			var npos = {};
			var itr = 0;
			while (this.pos.y != limit && itr<10) {
				this.boundX()
				npos = this.checkcross();
				npos.time = this.calctime(this.pos,npos);
				this.pos = npos;
				route.push(npos);
				itr++;
			}			
			return route;
		}

	};
	
	return Ball;
	
})();