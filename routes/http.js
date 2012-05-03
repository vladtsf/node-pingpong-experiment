var
	db = require('../lib/db'),
	md5 = require('MD5'),
	User = require('../models/user');

/*
 * GET home page.
 */

exports.index = function(req, res){
	if(!req.session.user) {
		res.redirect('/login/', 301);
	} else {
		res.render('index', {
			page: 'index',
			session: req.session,
			game:require('../lib/game')
		});
	}
};

exports.loginForm = function(req, res) {
	res.render('login', {
		page: 'login',
		session: req.session
	});
}

exports.registrationForm = function(req, res) {
	res.render('registration', {
		page: 'registration',
		session: req.session
	});
}

exports.login = function(req, res) {
	var form = req.form;
	if(form.isValid) {
		User.find({login:form.login, password: md5(form.password)}, function (err, docs) {
			if(docs.length > 0) {
				req.session.user = docs[0];
				res.redirect('/', 301);
			} else {
				res.redirect('/registration/', 301);
			}
		})
	} else {
		res.redirect('/registration/', 301);
	}
}

exports.logout = function(req, res) {
	delete req.session.user;
	res.redirect('/', 301);
}

exports.registration = function(req, res) {
	var form = req.form;
	if(form.isValid && form.password[0] == form.password[1]) {
		User.find({login:form.login}, function (err, docs) {
			if(docs.length == 0) {
				var user = new User();

				user.login = form.login;
				user.password = md5(form.password[0]);
				user.score = 0;

				user.save(function(err) {
					req.session.user = user;
					res.render('registered', {
						page:'registration',
						session: req.session
					});
				})

			} else {
				res.redirect('/registration/', 301);
			}
		})
	} else {
		res.redirect('/registration/', 301);
	}
}