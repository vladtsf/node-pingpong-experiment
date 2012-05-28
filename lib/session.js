var 
	MongoStore = require('connect-mongodb'),
	db = require('./db').connections[0].db;

module.exports = new MongoStore({db: db});