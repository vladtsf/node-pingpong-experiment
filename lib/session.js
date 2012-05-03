var MongoStore = require('connect-mongo')(require('express'));
module.exports = new MongoStore({db: 'test'});