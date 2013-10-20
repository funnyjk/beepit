var	mongoose = require('mongoose'),
	db = mongoose.Schema;

var	bopSchema  = new db ({
		gameID: Number,
		actnum: Number,
		time: Number,
		timeInt: Number,
		action: String
	});

	mongoose.model('game', bopSchema);
	mongoose.connect('localhost', 'beepit');
