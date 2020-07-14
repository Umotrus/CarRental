
    import User   from '../entity/user';
    import Rental from '../entity/rental';
    import Car    from '../entity/car';

    const BASE_URL = "/car-rental/rest-api/v1";

    const USER_URL    = "/user";
    const LOGIN_URL   = "/login";
    const LOGOUT_URL  = "/logout";
    const CARS_URL    = "/cars";
    const PRICE_URL   = '/price';
    const RENTALS_URL = "/rentals";
    const PAY_URL     = "/payment";

    /*
    * GET user data
    */
    const getUser = async () => {
    
        const res  = await fetch(BASE_URL + USER_URL);
        const json = await res.json();
        
        if(res.ok)
            return new User(json);
        else
            throw json;
    }

    /*
    *  POST Log in 
    */
    const login = async (user) => {
        
        const res = await fetch(BASE_URL + LOGIN_URL, {
                                                method:  'POST',
                                                headers: {'Content-Type': 'application/json'},
                                                body:    JSON.stringify(user.toDataTransferObject())
                                            });
        
        const json = await res.json();
        
        if( res.ok ){
            return new User(json);
        }
        else{
            throw json; 
        }
    }

    /*
    * POST log out
    */
    const logout = async () => {
        
        const res = await fetch(BASE_URL + LOGOUT_URL, { method: 'POST' });
        
        if(res.ok)
            return true
        else{
            throw await res.json(); 
        }
    }

    /*
    * GET cars
    */
    const getCars = async () => {
        
        const res  = await fetch(BASE_URL + CARS_URL);
        const json = await res.json();

        if(res.ok)
            return json.map( car => new Car(car) );
        else{
            throw json;
        }
    }

    /*
    * GET Rentals
    */
    const getRentals = async (userId) =>{
        
        const res  = await fetch(BASE_URL + RENTALS_URL + '?user=' + userId);
        const json = await res.json();

        if(res.ok)
            return json.map( r => new Rental(r) );
        else
            throw json;
    }

    /*
    * DELETE Rentals
    */
    const deleteRental = async (id) => {
        
        const res = await fetch(BASE_URL + RENTALS_URL + '/' + id, { method: 'DELETE' });
        
        if(res.ok)
            return id;
        else
            throw await res.json();
        
    }

    /*
    * POST Price
    */
    const getPriceAndCars = async (rental) => {
        
        const res = await fetch(BASE_URL + PRICE_URL, {
                                                            method: 'POST',
                                                            headers: {'Content-Type': 'application/json'},
                                                            body:    JSON.stringify(rental.toDataTransferObject())
                                                    });
        const json = await res.json();

        if(res.ok)
            return json; // Object containing cars number and rental price
        else
            throw json;
    }

    /*
    *  POST Rental
    */
    const newRental = async (rental) => {
        
        const res = await fetch(BASE_URL + RENTALS_URL,{
                                                            method: 'POST',
                                                            headers: {'Content-Type': 'application/json'},
                                                            body:    JSON.stringify(rental.toDataTransferObject())
                                                    });
        const json = await res.json();
        
        if(res.ok){
            if(json.success)
                return new Rental(json.rental);
            else
                throw json.error;
        }
        else
            throw json;
    }

    /*
    *  POST Pay
    */
    const payment = async (paymentInfo) => {
    
        const res = await fetch(BASE_URL + PAY_URL, {
                                                            method: 'POST',
                                                            headers: {'Content-Type': 'application/json'},
                                                            body:    JSON.stringify(paymentInfo)
                                                    });
        if(res.ok)
            return true;
        else{
            throw await res.json();
        }
    }


    const API = { getUser, login, logout, getCars, getRentals, getPriceAndCars, newRental, deleteRental, payment };
    export default API;
