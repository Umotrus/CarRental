
'use strict';

const db = require('../data/db');
const Car = require('../entity/car');

/*
 * Retrieves all cars available in the database
 */
exports.getCars = () => {
    const sql = "SELECT * \
                 FROM car ;";
    
    return new Promise( (resolve, reject) => {
        
        db.all(sql, (err,rows) => {
            if(err)
                reject(err);
            else
                resolve(rows.map( r => new Car(r) ));
        });
    });
    
}

/*
 * Retrieves all cars belonging to the given category that are not already rented in the given time window
 */
exports.getAvailableCars = (startDate, endDate, category) => {
    const sql = "SELECT * \
                 FROM car \
                 WHERE category = ? AND id NOT IN (SELECT carId \
                                                   FROM rental  \
                                                   WHERE startDate <= ? AND endDate >= ?);"; 
    // Inner query selects ids of cars that are rented in the given period
    
    return new Promise( (resolve, reject) => {
        
        db.all(sql, [category, endDate, startDate], (err,rows) => {

            if(err)
                reject(err);
            else
                resolve(rows.map( r => new Car(r) ));
        });
    });
}

/*
 * Retrieves the number of cars belonging to the given category
 */
exports.getCarsNumber = (category) => {
    const sql = "SELECT count(*) \
                 FROM car \
                 WHERE category = ? \
                 GROUP BY category"; 
    
    return new Promise( (resolve, reject) => {
        
        db.get(sql, [category], (err,result) => {
            if(err)
                reject(err);
            else
                resolve(result);
        });
    });
}
