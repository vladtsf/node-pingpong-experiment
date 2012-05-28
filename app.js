
/**
* Module dependencies.
*/

var 
	  express = require('express')
	, form = require("express-form")
   , field = form.field
   , app = module.exports = express.createServer()
   , util = require('util');

// Configuration

app.configure('development', function() {
	app.use(express.errorHandler({ dumpExceptions: true, showStack: true }));
	app.set('port', 3000);
	app.set('mongobase', 'mongodb://localhost/test');
});

app.configure('production', function(){
	app.use(express.errorHandler());
	app.set('port', 80);
	app.set('mongobase', util.format('mongodb://%s:%s@%s:%d/%s', process.env.DBUSER, process.env.DBPASSWORD, process.env.DBHOST, process.env.DBPORT, process.env.DBBASE));
});

app.configure(function(){
	app.set('views', __dirname + '/views');
	app.set('view engine', 'jade');
	app.set('view options', {layout: false});
	app.use(express.bodyParser());
	app.use(express.cookieParser());
	app.use(express.session({ 
		secret: "5a260b696d83f103c13a80a31b04f2b4",
		key: 'sid',
		store: require('./lib/session')
	}));
	app.use(express.methodOverride());
	app.use(app.router);
	app.use(express.static(__dirname + '/public'));
});

// Routes

app.configure(function() {
	var routes = {
			http: require('./routes/http'),
			api	: require('./routes/api')
		};

	app.get('/', routes.http.index);
	app.get('/login/', routes.http.loginForm);
	app.get('/logout/', routes.http.logout);
	app.get('/registration/', routes.http.registrationForm);

	app.get('/api/players.json', routes.api.players);
	app.get('/api/whoami.json', routes.api.whoami);

	app.post('/registration/', form(
		  field('login').trim().required().is(/^[a-z0-9]+$/i)
		, field("password[0]").trim().required()
		, field("password[1]").trim().required()
	),routes.http.registration);

	app.post('/login/', form(
		  field('login').trim().required()
		, field("password").trim().required()
	),routes.http.login);
});

app.listen(app.settings.port, function() {
	console.log("Listening on port %d in %s mode", app.address().port, app.settings.env);
});