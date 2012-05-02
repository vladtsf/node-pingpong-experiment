
/*
 * GET home page.
 */

exports.index = function(req, res){
	console.log(req.session.userID)
	res.render('index', { title: 'Express' })
};