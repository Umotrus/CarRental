
'use strict';

const db = require('../data/db');
const User = require('../entity/user');

const bcrypt = require('bcrypt');

/*
 *  Retrieves a user given the username
 */
exports.getUserByUsername = (username) => {
    const sql = "SELECT * \
                 FROM user \
                 WHERE username = ? ;";
    
    return new Promise( (resolve, reject) => {
        
        db.get(sql, [username], (err,result) => {

            if(err)
                reject(err);
            else{
                if(result)
                    resolve( new User(result) );
                else
                    resolve(null);
            }
        });
    });
}

/*
 *  Retrieves a user given the id
 */
exports.getUserById = (id) => {
    const sql = "SELECT * \
                 FROM user \
                 WHERE id = ? ;";
    
    return new Promise( (resolve, reject) => {
        
        db.get(sql, [id], (err,result) => {

            if(err)
                reject(err);
            else{
                if(result)
                    resolve( new User(result) );
                else
                    resolve(null);
            }
        });
    });
}

/*
 * Checks if the provided plain text password is valid for the user
 */
exports.checkCredentials = (user, textPassword) => {
    
    return bcrypt.compare(textPassword, user.getPassword());
}
