
'use strict';

const db = require('../data/db');
const Rental = require('../entity/rental');

/*
 * Inserts a new rental in the database
 */
exports.insertRental = (rental) => {
    const sql = "INSERT INTO rental(userId, carId, startDate, endDate, driverAge, driversNumber, extraInsurance, kmPerDay, discountApplies, price, paid) \
                 VALUES (?,?,?,?,?,?,?,?,?,?,?);";
    
    return new Promise( (resolve, reject) => {

        db.run(sql, [
                        rental.getUserId(),
                        rental.getCarId(),
                        rental.getStartDate(),
                        rental.getEndDate(),
                        rental.getDriverAge(),
                        rental.getDriversNumber(),
                        rental.getExtraInsurance() ? 1:0, 
                        rental.getKmPerDay(),
                        rental.getDiscountApplies() ? 1:0,
                        rental.getPrice(),
                        rental.getPaid() ? 1:0
                    ], 
        function(err){

            if(err)
                reject(err);
            else
                resolve(this.lastID);
        });
    });
}

/*
 *  Retrieves all the rentals for the given userId
 */
exports.getUserRentals = (userId) => {
    const sql = "SELECT R.id, R.userId, C.category, R.startDate, R.endDate, R.driverAge, R.driversNumber, R.extraInsurance, R.kmPerDay, R.discountApplies, R.price, R.paid \
                 FROM rental R, car C \
                 WHERE R.paid = 1 AND R.carId = C.id AND userId = ? ;";
    
    return new Promise( (resolve, reject) => {
        
        db.all(sql, [userId], (err,rows) => {

            if(err)
                reject(err);
            else
                resolve(rows.map( row => new Rental(row) ));
        });
    });
}

/*
 *  Retrieves a rental given the id
 */
exports.getRentalById = (id) => {
    const sql = "SELECT R.id, R.userId, C.category, R.startDate, R.endDate, R.driverAge, R.driversNumber, R.extraInsurance, R.kmPerDay, R.discountApplies, R.price, R.paid \
                 FROM rental R, car C\
                 WHERE R.carId = C.id AND R.id = ? ;";
    
    return new Promise( (resolve, reject) => {
        
        db.get(sql, [id], (err,result) => {

            if(err)
                reject(err);
            else{
                if(result)
                    resolve( new Rental(result) );
                else
                    resolve(null);
            }
        });
    });
}

/*
 * Updates a rental marking it as paid
 */
exports.setRentalPaid = (id) => {
    const sql = "UPDATE rental \
                 SET paid = 1 \
                 WHERE id = ?;";
    
    return new Promise( (resolve, reject) => {
        
        db.run(sql, [id], (err) => {
                                if(err)
                                    reject(err);
                                else
                                    resolve();
                            });
    });
}

/*
 * Deletes an existing rental
 */
exports.deleteRental = (id) => {
    const sql = "DELETE \
                 FROM rental \
                 WHERE id = ?;";
    
    return new Promise( (resolve, reject) => {
        
        db.run(sql, [id], (err) => {
                                if(err)
                                    reject(err);
                                else
                                    resolve();
                            });
    });
}

/*
 * Deletes an existing rental by id if it was not paid
 */
exports.deleteNotPaidRentalById = (id) => {
    const sql = "DELETE \
                 FROM rental \
                 WHERE id = ? AND paid = 0;";
    
    return new Promise( (resolve, reject) => {
        
        db.run(sql, [id], (err) => {
                                if(err)
                                    reject(err);
                                else
                                    resolve();
                            });
    });
}
/*
 * Delete every rental which was not paid
 */
exports.deleteNotPaidRentals = () => {
        
    const sql = "DELETE \
                 FROM rental \
                 WHERE paid = 0;";
    
    return new Promise( (resolve, reject) => {
        
        db.run(sql, (err) => {
                                if(err)
                                    reject(err);
                                else
                                    resolve();
                            });
    });
}





