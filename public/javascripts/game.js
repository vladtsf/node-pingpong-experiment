(function($, undefined) {
	var socket = io.connect('/ws/');

	var Game = {};

	Game.locked = false;

	var requests = [
		  void 0
		, $.getJSON('/api/whoami.json') // whoami
	];

	var routes = {
		'play' : /^\/play\/([\w\d]+)$/
	};

	Game.keys = {
		LEFT		: 37,
		RIGHT		: 39
	};

	Game.speed = {
		pad: 12
	};

	Game.net = {
		clUpdateRate	: 50,
		srvSyncRate		: 60
	};

	Game.direction = 0;
	Game._lastPosition = 0;
	Game._opponentLastPosition = 145; // костылик

	$
		.when.apply($, requests)
		.done(function(undefined, whoami) {
			socket.on('connect', function() {
				$(function() {
					var
						$opponentsTable = $('#opponents tbody');

					var
						$player1 = $('#player1'),
						$player2 = $('#player2')

					Game.whoami = whoami[0];

					Game.actions = {
						play: function(e, id) {
							if(e.type == 'hashchange') {
								socket.emit('invite', {
									me		: Game.whoami.id,
									opponent: id[1]
								});

								location.hash = '#!';
							} else {
								location.hash = '#!';
							}
						}
					};

					$(window)
						.on('hashchange game:hashchange ', function(e) {
							var hash = location.hash.replace('#!', '');

							$.each(routes, function(action, reg) {
								if(reg.test(hash) && Game.actions[action]) {
									Game.actions[action].call(Game, e, hash.match(reg));
									return false;
								}
							})
						})

					if(location.hash) {
						$(window).trigger('game:hashchange');
					}

					socket
						.on('player_join', function(e) {
							$opponentsTable
								.prepend('<tr data-id="' + e.id + '"><td><i class="icon-user"></i><span>&nbsp;</span><span>' + e.login + '</span><span>&nbsp;</span><span class="badge badge-inverse">' + (e.score || 0) + '</span></td><td><a href="#!/play/' + e.id + '">Play</a></td></tr>')
						})
						.on('player_leave', function(e) {
							$opponentsTable
								.find('[data-id="' + e.id + '"]')
								.remove();
						})
						.on('invitation', function(e) {
							var data = {
								to		: e.id,
								answer	: confirm('Player ' + e.login + ' invites you! Accept?')
							};

							socket.emit('invitation_reply', data);
						})
						.on('goto_room', function(room) {
							// start game
							$(document.body)
								.on('keydown', function(e) {
									switch(e.keyCode) {
										case Game.keys.LEFT:
											Game.direction = -1;
											return false;
											break;

										case Game.keys.RIGHT:
											Game.direction = 1;
											return false;
											break;

										default:
											break;
									}
								})
								.on('keyup', function(e) {
									var key = 0;

									if(e.keyCode == Game.keys.LEFT) {
										key = -1;
									} else if (e.keyCode == Game.keys.RIGHT) {
										key = 1;
									}

									if(key == Game.direction) {
										Game.direction = 0;
									}
								});


								// game timers
								Game._mvInterval = setInterval(
									function() {
										var position = parseInt($player1.css('margin-left').replace('px', ''));
										if(Game.direction) {
											if((Game.direction == -1 && position >= 3) || (Game.direction == 1 && position <= 287)) {
												var dest = position + Game.direction * Game.speed.pad;

												$player1.animate({
													marginLeft	: dest + 'px'
												}, Game.net.clUpdateRate - 10);
											}
										}
									}
								, Game.net.clUpdateRate);

								Game._syncInterval = setInterval(
									function() {
										var position = parseInt($player1.css('margin-left').replace('px', ''));

										if(position - Game._lastPosition != 0) {
											Game._lastPosition = position;

											socket
												.emit('srv_sync_position', {
													position	: position
												});
										}
									}
								, Game.net.srvSyncRate);
						})
						.on('cl_sync_position', function(e) {
							var
								speedCoeff = Math.floor((Game.net.clUpdateRate - 10) / Game.speed.pad),
								distance = Math.abs(Game._opponentLastPosition - e.position),
								time = speedCoeff * distance;

							Game._opponentLastPosition = e.position;

							$player2
								.animate({
									marginLeft	: e.position + 'px'
								}, time);
						});
				});
			});

		})

})(jQuery);