
    import React from 'react';

    // Router
    import { Redirect } from 'react-router-dom';
    // Components
    import NewRentalForm from './NewRentalForm';
    import PaymentModal  from './PaymentModal'; 
    // React bootstrap
    import Container from 'react-bootstrap/Container';
    import Row from 'react-bootstrap/Row';
    // Other modules
    import CarRentalException from '../../entity/CarRentalException';

    import API from '../../data/API';

    /*
    * Handles the insertion of a new rental
    */
    class Configurator extends React.Component {
        
        constructor(props){
            super(props);
            this.state = {
                loading: false,
                mode:    'form',
                rental:  null,
                error:   null
            };
        }
        
                
        render(){
            
            if(this.state.mode === 'done')
                return <Redirect to='/rentals' />;
            
            return <Container>

                        <ConfiguratorHeader/>
                        <NewRentalForm onSubmit={this.bookRental} loading={this.state.loading} errorMessage={this.state.error}/>
                        { this.state.rental && <PaymentModal show={this.state.mode === 'pay'} price={this.state.rental.getPrice()} rentalId={this.state.rental.getId()} onHide={this.cancelPayment} onPaymentDone={this.onRentalCompleted}/> }
                </Container>;
        }
        
        // Saves the rental booking to the database
        bookRental = (rental) => {
            this.setState({ loading: true, rental: null, error: null });
            
            API.newRental(rental).then( r => {
                                    this.setState({ loading: false, mode: 'pay', rental: r });
                                })
                                .catch( err => {
                                    this.setState({ loading: false, error: new CarRentalException(err, "Booking failed").getUserMessage() });
                                });
        }
        
        // Deletes the rental booking if the user undoes it before payment
        cancelPayment = () => {
            API.deleteRental(this.state.rental.getId()); // Do not do anything in case of error, the server will delete the rental anyway after the timeout
            
            this.setState({ mode: 'form'});
        }
        
        // Changes the mode to done --> user is redirected to the page listing rentals
        onRentalCompleted = () => {
        
            this.setState({ mode: 'done' });
        }
    }

    export default Configurator;


    function ConfiguratorHeader(props){
        
        return <Row className="p-5 align-items-center justify-content-center">
                    <h1> New Rental </h1>
            </Row>;
    }
