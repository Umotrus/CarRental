
    'use strict'

    /*
    * Generic exception class, contains a message for the user and possibly some details more
    */
    module.exports = class CarRentalException {
    
        
        constructor(errorObject, alternativeMessage){
        
            this.userMessage = errorObject.userMessage || alternativeMessage || "Unknown error";
            this.detailedError = errorObject.detailedError || errorObject;
        }
        
        toDataTransferObject = () => ({
                                    userMessage: this.getUserMessage(),
                                    detailedError: this.getDetailedError() || null
                                });
        
        // Getters
        getUserMessage   = () => this.userMessage;
        getDetailedError = () => this.detailedError; 
    }
