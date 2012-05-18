module.exports = (function() {
	
	var Ball = function() {
		this.pos = {x:0,y:0};
		this.spd= {x:8,y:13};
		this.realspd = 0.5;
		this.radius = 10;	
		this.rect={
			min:{x:this.radius,y:this.radius},
			max:{x:300-this.radius,
				y:500-this.radius
			}
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
			var y;
			var x;
			if (this.spd.y<0){
				y = this.rect.min.y;
				x = (y*this.spd.y -c)/this.spd.x;		
			} else if (this.spd.y>0){
				y = this.rect.max.y;
				x = (y*this.spd.y -c)/this.spd.x;
			}		

			if ((x<this.rect.min.x)||(x>this.rect.max.x)){
				if(this.spd.x>0){
					x=this.rect.max.x;
					y= (x*this.spd.x+c)/this.spd.y
				} else if((this.spd.x<0)){
					x = this.rect.min.x;
					y= (x*this.spd.x+c)/this.spd.y;
				}
			}
			return {"x":x,"y":y};    
		},
		
		
		boundY:	function() {
			if ((this.pos.y==this.rect.min.y)||(this.pos.y==this.rect.max.y)){
				this.spd.y = -this.spd.y;
			}
			
			return this;
		},
		
		boundX:	function() {
			if ((this.pos.x==this.rect.max.x)||(this.pos.x==this.rect.min.x)){
				this.spd.x = -this.spd.x;
			}
			
			return this;
		},
		
		calctime:	function(pos1, pos2) {
			var dist = Math.sqrt((pos2.x-pos1.x)*(pos2.x-pos1.x) + (pos2.y-pos1.y)*(pos2.y-pos1.y));
			var time = dist / this.realspd;
			return time;
		},
		
		
		newRoute:	function() {
			var limit = this.rect.min.y;
			if (this.spd.y>0){
				limit = this.rect.max.y;
			}
			var route=[];
			var npos = this.pos;
			var itr = 0;
			do{
				this.boundX()
				npos = this.checkcross();
				npos.time = this.calctime(this.pos,npos);
				this.pos = npos;
				route.push(npos);
				itr++;
			}			
			while (this.pos.y != limit && itr<10);
			return route;
		}

	};
	
	return Ball;
	
})();