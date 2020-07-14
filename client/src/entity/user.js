

module.exports = class User{
    
    /*
     * Receives an object containing the needed properties 
     * Returns a new User object
     *
     * Does not check values since user objects are supposed to be read-only
     */
    
    constructor(obj){
        
        this.id = obj.id;
        this.username = obj.username;
        this.password= obj.password;
    }
    
    /*
     * Returns an object used for data transmission between client and server
     */ 
    toDataTransferObject = () => ({
                                    id:       this.id,
                                    username: this.username,
                                    password: this.password
                                 })
                                 
    // Getters
    getId = () => this.id;
    getUsername = () => this.username;
    getPassword = () => this.password;
}
