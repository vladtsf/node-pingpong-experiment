var
	mongoose = require('mongoose'),
	Schema = mongoose.Schema
	, ObjectId = Schema.ObjectId;

var User = new Schema({
    login	: String
  , password: String
  , score	: Number
});

module.exports = mongoose.model('User', User);