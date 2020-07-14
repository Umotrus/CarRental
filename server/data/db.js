
'use strict';

const sqlite = require('sqlite3');


module.exports = new sqlite.Database('data/car_rental.db', (err) => {
	if(err)
		throw err;
});
