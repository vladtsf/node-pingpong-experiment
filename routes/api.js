exports.players = function(req, res) {
	res.json(require('../lib/game').players)
};

exports.whoami = function(req, res) {
	if(req.session.user) {
		res.json({
			login : req.session.user.login,
			score : req.session.user.score || 0,
			id : req.session.user._id
		})
	}
}