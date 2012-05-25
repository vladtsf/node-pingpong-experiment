window.Ball = (function(sock) {
	var Ball=function(sock) {
		this.animationTrac = [];
		this.$selector = $('.ball');
		this.sock = sock;
	};
	
	Ball.prototype = {
		
		endAnimate:	function(){
			this.sock.emit('checkGoal');				
		},
		
		Iteration: function(){			
			if (this.animationTrac.length > 0){
				var trac = this.animationTrac.shift();
				this.$selector.animate(
					{
						'margin-top':trac.y,
						'margin-left':trac.x
					},
					trac.time,
					'linear',
					this.Iteration.bind(this)
				)
				
			} else {
				if (this.$selector.css("margin-top") == "360px"){
					this.endAnimate();	
				}
			}			
		},
		
		setTrac: function(trac){
			this.$selector.stop()
			this.animationTrac = trac;
			this.Iteration();
		}		
		
	};
	
	return Ball;		
	
})(jQuery);