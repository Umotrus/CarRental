
'use strict';

module.exports = class Car{
    
    /*
     * Receives an object containing the needed properties 
     * Returns a new Car object
     *
     * Does not check values since car objects are supposed to be read-only
     */
    constructor(obj){
        
        this.id = obj.id;
        this.brand = obj.brand;
        this.model = obj.model;
        this.category = obj.category;
    }
    
    /*
     * Returns an object used for data transmission between client and server
     */ 
    toDataTransferObject = () => ({
                                    id:       this.id,
                                    brand:    this.brand,
                                    model:    this.model,
                                    category: this.category
                                 })
                                 
    
    // Getters
    getId = () => this.id;
    getBrand = () => this.brand;
    getModel = () => this.model;
    getCategory = () => this.category;
}
