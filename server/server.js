
    const express = require('express');

    // External modules
    const { body, query, param, validationResult } = require('express-validator');
    const morgan       = require('morgan');
    const jwt          = require('express-jwt');
    const jsonwebtoken = require('jsonwebtoken');
    const cookieParser = require('cookie-parser');
    const moment       = require('moment');

    // JWT 
    const JWTsecret = require('./secret');
    const TOKEN_EXPIRATION_SECONDS = 60 * 30;

    // Data Access Objects
    const carDao    = require('./dao/carDao');
    const rentalDao = require('./dao/rentalDao');
    const userDao   = require('./dao/userDao');

    // Entities
    const Car                = require('./entity/car');
    const Rental             = require('./entity/rental');
    const User               = require('./entity/user');
    const CarRentalException = require('./entity/CarRentalException');

    // HTTP status codes
    const CREATED      = 201;
    const NO_CONTENT   = 204;
    const BAD_REQUEST  = 400;
    const UNAUTHORIZED = 401;
    const FORBIDDEN    = 403;
    const NOT_FOUND    = 404;
    const SERVER_ERROR = 500;

    // API endpoints
    const API_BASE_URL = '/car-rental/rest-api/v1';

    const USER    = '/user';
    const CARS    = '/cars';
    const LOGIN   = '/login';
    const LOGOUT  = '/logout';
    const RENTALS = '/rentals';
    const PAY     = '/payment';
    const PRICE   = '/price';

    // Start server
    const PORT = 3001;

    app = new express();

    app.use(express.json());
    app.use(morgan('tiny'));

    app.listen(PORT, ()=>console.log(`Server running on http://localhost:${PORT}/`));

    /* -------------------------------------------------------------------------------------------- PUBLIC ROUTES -------------------------------------------------------------------------------------------- */

    /*
    * GET /cars
    * 
    * Retrieves the complete list of cars
    * 
    * Request body: none
    * 
    * Response body: list of car dtos
    * 
    */
    app.get(API_BASE_URL + CARS, (req,res)=>{
        
        carDao.getCars()
                    .then( cars => {
                                res.json(cars.map( c => c.toDataTransferObject() ));
                    } )
                    .catch( e => {
                                console.error(e); 
                                res.status(SERVER_ERROR).json(new CarRentalException({ userMessage: "Server side error", detailedError: e }).toDataTransferObject() );
                        
                    } );
    });

    /*
    * POST /login
    * 
    * Logs in a user providing the authentication cookie
    * 
    * Request body: user dto
    * 
    * Response body: user dto
    * 
    */
    app.post(API_BASE_URL + LOGIN, 
            [
                body('username').exists().withMessage("Missing username").isString().notEmpty(),
                body('password').exists().withMessage("Missing password").isString().notEmpty()
            ],
        (req, res) => {
        
        // Request validation
        const validationErrors = validationResult(req);
        if(!validationErrors.isEmpty()){
            sendValidationError(res, validationErrors);
            return;
        }
        
        // Retrieve login parameters
        const username = req.body.username;
        const password = req.body.password;
        
        // Search for the user in the DB
        userDao.getUserByUsername(username)
                        .then( async u => {

                            if(!u){
                                // User is not in the DB
                                res.status(NOT_FOUND).json( new CarRentalException({ userMessage: "User does not exist" }).toDataTransferObject() );
                                return;
                            }
                            
                            const match = await userDao.checkCredentials(u, password);

                            if(match){
                                // Allow login
                                const user = new User({ id: u.getId(), username: u.getUsername()/*, password: req.body.password*/});
                                const token = jsonwebtoken.sign({authUserId: u.getId()}, JWTsecret, {expiresIn: TOKEN_EXPIRATION_SECONDS});
                                
                                res.cookie('token', token, {httpOnly: true, sameSite: true, maxAge: 1000 * TOKEN_EXPIRATION_SECONDS})
                                .json( user.toDataTransferObject() );
                            }
                            else{
                                // Add delay and prevent login
                                await new Promise( (resolve) => { setTimeout(resolve, 1000) } );
                                res.status(UNAUTHORIZED).json( new CarRentalException({ userMessage: "Username and password do not match" }).toDataTransferObject() );
                            }
                        })
                        .catch( e => {
                            console.error(e);
                            res.status(SERVER_ERROR).json(new CarRentalException({ userMessage: "Server side error", detailedError: e }).toDataTransferObject() );
                        });
    });

    app.use(cookieParser());

    /*
    * POST /logout
    * 
    * Logs out a user by making the browser delete the cookie
    * 
    * Request body: none
    * 
    * Response body: none
    * 
    */
    app.post(API_BASE_URL + LOGOUT, (req, res) => {
        
        res.clearCookie('token').status(NO_CONTENT).end();
    });

    /*
    * POST /payment
    * 
    * Receives payments
    * 
    * Request body: rental id, credit card number, full name and CVV
    * 
    * Response body: none
    * 
    */
    app.post(API_BASE_URL + PAY,
            [
                body('number').exists().withMessage("Missing card number").notEmpty(),
                body('name').exists().withMessage("Missing full name").notEmpty(),
                body('CVV').exists().withMessage("Missing CVV").notEmpty(),
                body('rentalId').exists().withMessage("Missing rental id").isInt({ min: 0 })
            ],
        async (req, res) => {
            
            // Check fields presence
            const errors = validationResult(req);
            if(!errors.isEmpty())
                return sendValidationError(res, errors );
            
            const rental = await rentalDao.getRentalById(req.body.rentalId);
            
            // Check if rental exists
            if(!rental)
                return res.status(NOT_FOUND).json( new CarRentalException({ userMessage: "Rental does not exist" }).toDataTransferObject() );
            
            // Mark rental as paid
            rentalDao.setRentalPaid(req.body.rentalId)
                    .then( () => {
                        res.status(NO_CONTENT).end();
                    })
                    .catch( e => {
                        console.error(e);
                        res.status(SERVER_ERROR).json(new CarRentalException({ userMessage: "Server side error", detailedError: e }).toDataTransferObject() );
                    });
    });


    /* -------------------------------------------------------------------------------------------- PRIVATE ROUTES -------------------------------------------------------------------------------------------- */


    // Verify cookie
    app.use( jwt({
                    secret: JWTsecret,
                    getToken: req => req.cookies.token
                })
    );

    app.use(function(err, req, res, next) {
                if(err.name === 'UnauthorizedError') { 

                    res.status(UNAUTHORIZED).json( new CarRentalException({ userMessage: "Error: authentication required!" }).toDataTransferObject() );
                    
                }}
    );

    /*
    * GET /user
    * 
    * Retrieves user data
    * 
    * Request body: none
    * 
    * Response body: user dto
    * 
    */
    app.get(API_BASE_URL + USER,  (req, res) => {

            // Retrieve user
            userDao.getUserById(req.user.authUserId)
                            .then( user => {
                                res.json( new User({ id: user.getId(), username: user.getUsername() }).toDataTransferObject() );
                                
                            })
                            .catch( e => {
                                console.error(e);
                                res.status(SERVER_ERROR).json(new CarRentalException({ userMessage: "Server side error", detailedError: e }).toDataTransferObject() );
                            });
    });


    /*
    * GET /rentals?user=<id>
    * 
    * Retrieves all rentals completed or booked by the user
    * 
    * Request body: none
    * 
    * Response body: list of rental dtos
    * 
    */
    app.get(API_BASE_URL + RENTALS, 
            [
                query('user').exists().withMessage("Missing user id").isInt({min:1})
            ],
        (req, res) => {

            // Check validation results
            const errors = validationResult(req);
            if(!errors.isEmpty())
                return sendValidationError(res, errors);

            // Check if query user id matches the authentication token
            if(+req.query.user !== req.user.authUserId)
                return res.status(FORBIDDEN).json( new CarRentalException({ userMessage: "Access not allowed"}).toDataTransferObject() );

            // Retrieve rentals
            rentalDao.getUserRentals(req.query.user)
                            .then( rentals => {
                                res.json(rentals.map( r => r.toDataTransferObject() ));
                                
                            })
                            .catch( e => {
                                console.error(e);
                                res.status(SERVER_ERROR).json(new CarRentalException({ userMessage: "Server side error", detailedError: e }).toDataTransferObject() );
                            });
    });

    /*
    * POST /rentals
    * 
    * Adds a new rental, sets a timer that deletes it if it is not payed
    * 
    * Request body: rental dto
    * 
    * Response body: outcome and rental dto
    * 
    */
    app.post(API_BASE_URL + RENTALS, 
            [
                body('category').exists().withMessage("Missing car category").isIn(["A","B","C","D","E"]),
                body('startDate').exists().withMessage("Missing start date").isString().custom(checkDateFormat).custom(dateIsFuture),
                body('endDate').exists().withMessage("Missing end date").isString().custom(checkDateFormat).custom( (value, {req}) => value >= req.body.startDate ),
                body('driverAge').exists().withMessage("Missing driver age").isInt({ min:18 }),
                body('driversNumber').exists().withMessage("Missing drivers number").isInt({ min: 1 }),
                body('extraInsurance').exists().withMessage("Missing extra insurance").isInt({min: 0, max:1}),
                body('kmPerDay').exists().withMessage("Missing km per day").isInt({ min: 0 }),
            ],
        async (req, res) => {
            
            // Check validation results
            const errors = validationResult(req);
            if(!errors.isEmpty())
                return sendValidationError(res, errors);
            
            // Check if there are available cars
            const availableCars = await carDao.getAvailableCars(req.body.startDate, req.body.endDate, req.body.category);
            
            if(availableCars.length === 0)
                return res.json({ success: false, error: new CarRentalException({ userMessage: "No available cars"}).toDataTransferObject() });

            // Create new rental
            const rental = new Rental({
                                            userId:         req.user.authUserId,
                                            carId:          availableCars[0].getId(),
                                            category:       req.body.category,
                                            startDate:      req.body.startDate,
                                            endDate:        req.body.endDate,
                                            driverAge:      req.body.driverAge,
                                            driversNumber:  req.body.driversNumber,
                                            extraInsurance: req.body.extraInsurance,
                                            kmPerDay:       req.body.kmPerDay,
                                            paid:           false
            });
            
            await computePriceAndAvailableCars(rental);
            
            rentalDao.insertRental(rental)
                            .then( id => {
                                rental.setId(id);
                                
                                // Set a timeout, when it sets off if the rental has not been paid it is deleted
                                setTimeout( () => { rentalDao.deleteNotPaidRentalById(id); }, 1000 * 60 * PAYMENT_TIMEOUT_MINUTES);
                                
                                res.status(CREATED).json({ success: true, rental: rental.toDataTransferObject() });
                            })
                            .catch( e => {
                                console.error(e);
                                res.status(SERVER_ERROR).json(new CarRentalException({ userMessage: "Server side error", detailedError: e }).toDataTransferObject() );
                            });
            
    });

    /*
    * DELETE /rentals/<id>
    * 
    * Cancels a booked rental
    * 
    * Request body: none
    * 
    * Response body: none
    * 
    */
    app.delete(API_BASE_URL + RENTALS + '/:id', 
            [
                    param('id').isInt({ min: 1 })
            ],
        async (req, res) => {
            
            // Check validation results
            const errors = validationResult(req);
            if(!errors.isEmpty())
                return sendValidationError(res, errors);

            
            const rental = await rentalDao.getRentalById(req.params.id);
            
            // Check if rental exists
            if(!rental)
                return res.status(NOT_FOUND).json( new CarRentalException({ userMessage: "Rental does not exist" }).toDataTransferObject() );

            // Check if the user 'owns' the rental and the rental is future
            if(rental.getUserId() !== req.user.authUserId || rental.hasStarted())
                return res.status(FORBIDDEN).json( new CarRentalException({ userMessage: "Deletion is not allowed" }).toDataTransferObject() );
            
            // Delete rental
            rentalDao.deleteRental(req.params.id)
                            .then( () => {
                                res.status(NO_CONTENT).end();
                            })
                            .catch( e => {
                                console.error(e);
                                res.status(SERVER_ERROR).json(new CarRentalException({ userMessage: "Server side error", detailedError: e }).toDataTransferObject() );
                            });
    });

    /*
    * POST /price
    * 
    * Calculate the price for a rental
    * 
    * Request body: rental dto
    * 
    * Response body; calculated price and number of cars
    * 
    */
    app.post(API_BASE_URL + PRICE, 
            [
                body('category').exists().withMessage("Missing car category").isIn(["A","B","C","D","E"]),
                body('startDate').exists().withMessage("Missing start date").isString().custom(checkDateFormat).custom(dateIsFuture),
                body('endDate').exists().withMessage("Missing end date").isString().custom(checkDateFormat).custom( (value, {req}) => value >= req.body.startDate ),
                body('driverAge').exists().withMessage("Missing driver age").isInt({ min:18 }),
                body('driversNumber').exists().withMessage("Missing drivers number").isInt({ min: 1 }),
                body('extraInsurance').exists().withMessage("Missing extra insurance").isInt({min: 0, max:1}),
                body('kmPerDay').exists().withMessage("Missing km per day").isInt({ min: 0 }),
            ],
        (req, res) => {
            
            // Check validation results
            const errors = validationResult(req);
            if(!errors.isEmpty())
                return sendValidationError(res, errors);
            
            
            const rental = new Rental({
                                            userId:         req.user.authUserId,
                                            category:       req.body.category,
                                            startDate:      req.body.startDate,
                                            endDate:        req.body.endDate,
                                            driverAge:      req.body.driverAge,
                                            driversNumber:  req.body.driversNumber,
                                            extraInsurance: req.body.extraInsurance,
                                            kmPerDay:       req.body.kmPerDay,
            });
            
            computePriceAndAvailableCars(rental)
                            .then( n => {

                                res.json({"cars": n, "price": rental.getPrice()});
                            })
                            .catch( e => {
                                console.error(e);
                                res.status(SERVER_ERROR).json(new CarRentalException({ userMessage: "Server side error", detailedError: e }).toDataTransferObject() );
                            });
    });



    /* -------------------------------------------------------------------------------------------- BUSINESS LOGIC -------------------------------------------------------------------------------------------- */

    // Time available for payment
    const PAYMENT_TIMEOUT_MINUTES = 10;

    /*
    * if the server crashes or is stopped while a timer is running, it may happen that a rental which was not paid would not be deleted --> delete all the unpaid rentals in the db at server startup
    */ 
    rentalDao.deleteNotPaidRentals();

    /*
    * Computes and sets price and discount for the given rental, returns the number of available cars 
    */
    computePriceAndAvailableCars = async function(rental){
        
        // Pricing constants
        const dailyPriceByCategory = { "A": 80, "B": 70, "C": 60, "D": 50, "E": 40 };
        
        const kmThresholds = [ { km: 0, factor: 0.95 }, { km: 50, factor: 1 }, { km: 150, factor: 1.05 } ]; // Each object represent the lower threshold of the corresponding price interval (included)
        
        const ageThresholds = [ { age: 0, factor: 1.05 }, { age: 25, factor:1 }, { age: 66, factor:1.1 } ]; // Each object represent the lower threshold of the corresponding price interval (included) 
        
        const driversThresholds = [ { n: 1, factor:1 }, { n: 2, factor: 1.15 } ];                           // Each object represent the lower threshold of the corresponding price interval (included) 
        
        const extraInsuranceFactor = 1.2;               // Extra insurance cost
        
        const fewCarsFraction = 0.1                     // Fraction of cars that need to be available not to apply the penalty
        
        const fewCarsPenaltyFactor = 1.1;               // Penalty applied in case of few cars available
        
        const rentalsToGainDiscount = 3;                // Number of completed rentals needed to be a frequent customer
        
        const discountFactor = 0.9;                     // Discount for frequent customers
        
        
        // Retrieve needed values from paramter
        
        const category  = rental.getCategory();
        const kmPerDay  = rental.getKmPerDay();
        const driverAge = rental.getDriverAge();
        const drivers   = rental.getDriversNumber();
        const insurance = rental.getExtraInsurance();
        const start     = rental.getStartDate();
        const end       = rental.getEndDate();
        const userId    = rental.getUserId();
        
        // Retrieve info from the db
        const totCars       = await carDao.getCarsNumber(category);
        const availableCars = await carDao.getAvailableCars(start, end, category);
        const userRentals   = await rentalDao.getUserRentals(userId);

        // Compute price
        if(availableCars.length === 0){
            rental.setPrice(null);
            return 0;
        }

        const days = 1 + moment(end).diff(moment(start), 'days');
        
        let price = dailyPriceByCategory[category] * days;
        
        price *= kmThresholds.filter( t => t.km <= kmPerDay ).reduce( (t1,t2) => t1.km > t2.km ? t1:t2 ).factor;        // reduce not needed if original array is sorted
        
        price *= ageThresholds.filter( t => t.age <= driverAge ).reduce( (t1,t2) => t1.age > t2.age ? t1:t2 ).factor;
        price *= driversThresholds.filter( t => t.n <= drivers ).reduce( (t1,t2) => t1.n > t2.n ? t1:t2 ).factor;
        
        if(insurance)
            price *= extraInsuranceFactor;
        
        if( availableCars.length/totCars < fewCarsFraction )
            price *= fewCarsPenaltyFactor;
        
        if( userRentals.filter( r => r.isComplete() ).length >= rentalsToGainDiscount ){
            rental.setDiscountApplies(true);
            price *= discountFactor;
        }

        rental.setPrice( + price.toFixed(2) ); // Converts price to fixed point, back to number and sets it in the rental object
        return availableCars.length;
    }

    /* -------------------------------------------------------------------------------------------- VALIDATION UTILITIES -------------------------------------------------------------------------------------------- */


    /*
    * Sends to the client a bad request message and formats validation errors
    */
    sendValidationError = (res, errors) => {
        
        const errorsArray = errors.array({ onlyFirstError: true });
        
        res.status(BAD_REQUEST).json( new CarRentalException({ userMessage: errorsArray[0].msg + " (" + errorsArray[0].param + ")", detailedError: errorsArray }).toDataTransferObject() );
    }

    /*
    *  Check whether the date format is the correct one
    */
    function checkDateFormat(date){
        return moment(date, "YYYY-MM-DD", true).isValid();
    }
    
    /*
    * Check whether the date is future (including today)
    */
    function dateIsFuture(date){
        return date >= moment().format("YYYY-MM-DD");
    }
    
    
    
    
 
