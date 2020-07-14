
const moment = require('moment')

const MIN_DRIVER_AGE = 18;
const MIN_DRIVERS = 1;
const MIN_ID = 0;
const VALID_CATEGORIES = ["A","B","C","D","E"];
const MIN_KM_PER_DAY = 0;
const DATE_FORMAT = "YYYY-MM-DD";

module.exports = class Rental{
    
    /*
     * Receives an object containing the needed properties 
     * Returns a new Rental object
     *
     * Throws exceptions in case of missing mandatory values or invalid values 
     */
    constructor(obj){
        
        
        // if(property) is not suitable for values like false or 0
        
        if(obj.id !== undefined && obj.id !== null){
            if( (obj.id !== 0 && !(obj.id - 0)) /*is not a number*/ || obj.id < MIN_ID)
                throw buildErrorObject("Invalid id");
            this.id = obj.id - 0;
        }
        
        if(obj.userId !== undefined && obj.userId !== null){
            if( (obj.userId !== 0 && !(obj.userId - 0)) /*is not a nu,ber*/ || obj.userId < MIN_ID)
                throw buildErrorObject("Invalid user id");
            this.userId = obj.userId - 0;
        }

        if(obj.carId !== undefined && obj.carId !== null){
            if( ( obj.carId !== 0 && !(obj.carId - 0))/*is not a number */ || obj.userId < MIN_ID)
                throw buildErrorObject("Invalid car id");
            this.carId = obj.carId - 0;
        }
        
        if(obj.category === undefined || obj.category === null)
            throw buildErrorObject("Car category is missing");
        
        if(!VALID_CATEGORIES.some( c => c === obj.category))
            throw buildErrorObject("Invalid car category");
        
        this.category = obj.category;
        
        if(obj.startDate === undefined || obj.startDate === null)
            throw buildErrorObject("Start date is missing");
        
        this.startDate = moment(obj.startDate);
        
        if(!this.startDate.isValid())
            throw buildErrorObject("Invalid start date");
        
        if(obj.endDate === undefined || obj.endDate === null)
            throw buildErrorObject("End date is missing");
        
        this.endDate = moment(obj.endDate);
        
        if(!this.endDate.isValid())
            throw buildErrorObject("Invalid end date");
        
        if(this.endDate.format(DATE_FORMAT) < this.startDate.format(DATE_FORMAT))
            throw buildErrorObject("End date cannot be before start date");

        if(obj.driverAge === undefined || obj.driverAge === null)
            throw buildErrorObject("Driver age is missing");
        
        if( (obj.driverAge !== 0 && !(obj.driverAge - 0)) /*is not a number*/ || obj.driverAge < MIN_DRIVER_AGE)
            throw buildErrorObject("Invalid driver age");
        
        this.driverAge = obj.driverAge - 0;
        
        if(obj.driversNumber === undefined || obj.driversNumber === null)
            throw buildErrorObject("Drivers number is missing");
        
        if( (obj.driversNumber !== 0 && !(obj.driversNumber - 0))/*is not a number*/ || obj.driversNumber < MIN_DRIVERS)
            throw buildErrorObject("Invalid drivers number");
        
        this.driversNumber = obj.driversNumber - 0;
        
        if(obj.extraInsurance === undefined || obj.extraInsurance === null)
            throw buildErrorObject("Extra insurance is missing");
        
        this.extraInsurance = !! obj.extraInsurance;
        
        if(obj.kmPerDay === undefined || obj.kmPerDay === null)
            throw buildErrorObject("Km per day is missing");
        
        if((obj.kmPerDay !== 0 && !(obj.kmPerDay - 0))/*is not a number*/ || obj.kmPerDay < MIN_KM_PER_DAY)
            throw buildErrorObject("Invalid Km per day number");
        
        this.kmPerDay = obj.kmPerDay - 0;
        
        if(obj.discountApplies !== undefined && obj.discountApplies !== null)
            this.discountApplies = !! obj.discountApplies;
        
        if(obj.price !== undefined && obj.price !== null){
            if((obj.kmPerDay !== 0 && !(obj.kmPerDay - 0))/*is not a number*/ || obj.kmPerDay < MIN_KM_PER_DAY)
                throw buildErrorObject("Invalid price");
            this.price = obj.price - 0;
        }
        
        if(obj.paid !== undefined && obj.paid !== null){
            this.paid = !! obj.paid;
        }
    }
    
    /*
     * Returns an object used for data transmission between client and server
     */ 
    toDataTransferObject = () => ({
                                    id: this.id || null,
                                    //userId: this.userId || null,  // Implicit in login
                                    //carId: this.carId,|| null,    // Only known to the server, never transferred 
                                    category: this.category,
                                    startDate: this.startDate.format(DATE_FORMAT),
                                    endDate: this.endDate.format(DATE_FORMAT),
                                    driverAge: this.driverAge,
                                    driversNumber: this.driversNumber,
                                    extraInsurance: this.extraInsurance ? 1:0,
                                    kmPerDay: this.kmPerDay,
                                    discountApplies: ( (this.discountApplies !== undefined && this.discountApplies !== null) || null ) && (this.discountApplies ? 1:0),   // null if absent, 1 or 0 if present
                                    price: this.price || null,
                                    paid: ( (this.paid !== undefined && this.paid !== null) || null ) && (this.paid ? 1:0),   // null if absent, 1 or 0 if present              
                                 })
    
    /*
     * Returns true if the end date for the rental is in the past
     */
    isComplete = () => this.getEndDate() < moment().format("YYYY-MM-DD")
    
        /*
     * Returns true if the start date for the rental is in the past or today
     */
    hasStarted = () => this.getStartDate() <= moment().format("YYYY-MM-DD")
    
    
    // Getters
    getId = () => this.id;
    getUserId = () => this.userId;
    getCarId = () => this.carId;
    getCategory = () => this.category;
    getStartDate = (format) => this.startDate.format(format || DATE_FORMAT);
    getEndDate = (format) => this.endDate.format(format || DATE_FORMAT);
    getDriverAge = () => this.driverAge;
    getDriversNumber = () => this.driversNumber;
    getExtraInsurance = () => this.extraInsurance;
    getKmPerDay = () => this.kmPerDay;
    getDiscountApplies = () => this.discountApplies;
    getPrice = () => this.price;
    getPaid = () => this.paid;
    
    // Setters
    setDiscountApplies = (da) => {
        this.discountApplies = da ? true:false;
    }
    setPrice = (price) => {
        this.price = price;
    }
    setId = (id) => {
        this.id = id;
    }
}

function buildErrorObject(string){
    return { error: string};
}
