
    import React from 'react';
    // Router
    import { Link } from 'react-router-dom';
    // React bootstrap
    import Container from 'react-bootstrap/Container';
    import Row from 'react-bootstrap/Row';
    import Col from 'react-bootstrap/Col';
    import Spinner from 'react-bootstrap/Spinner';
    // Components
    import { ErrorMessage } from '../form/FormComponents';

    import RentalsTable from './RentalsTable';
    // Other modules
    import CarRentalException from '../../entity/CarRentalException';

    import API from '../../data/API';

    /*
    * Manages and splits the list of rentals, handles rental deletion
    */
    class RentalsManager extends React.Component {
        
        constructor(props){
            super(props);
            this.state = {
                userId:  this.props.user,
                rentals: [],
                loading: true,
                error:   null
            };
        }
        
        /*
        * Load the list of rentals
        */
        componentDidMount = () => {
            
            API.getRentals(this.state.userId).then( rentals => { 
                                                        this.setState({
                                                            rentals: rentals,
                                                            loading: false,
                                                            error:   null
                                                        });
                                                })
                                                .catch( err => {
                                                    this.setState({ loading: false, error: new CarRentalException(err, "Cannot retrieve rentals").getUserMessage() });
                                                });
        }
        
        render(){
            
            const pastRentals    = this.state.rentals.filter( r => r.isComplete() ); 
            const ongoingRentals = this.state.rentals.filter( r => r.hasStarted() && !r.isComplete() ); 
            const futureRentals  = this.state.rentals.filter( r => !r.hasStarted() ); 

            return <Container className="px-5">
                        <RentalsHeader />
                        
                        { this.state.error && <ErrorMessage message={this.state.error} /> }
                        { this.state.rentals.length === 0 && !this.state.error && <NoResults loading={this.state.loading}/> }

                        { ongoingRentals.length !== 0 && <RentalsTable label="Ongoing rentals" rentals={ongoingRentals} /> }
                        { futureRentals.length  !== 0 && <RentalsTable label="Future rentals" rentals={futureRentals} deletePossible={true} delete={this.delete}/> }
                        { pastRentals.length    !== 0 && <RentalsTable label="Past rentals" rentals={pastRentals} /> }

                </Container>;
        }
        
        /*
        * Delete the rental given the id
        */
        delete = (id) => {
            this.setState({ loading: true });
            
            API.deleteRental(id).then( (id) => {
                                    this.setState( previousState => ({
                                                                        rentals: previousState.rentals.filter( r => r.getId() !== id),
                                                                        loading: false
                                                                    }));
                                })
                                .catch( err => {
                                    this.setState({ loading: false, error: new CarRentalException(err, "Deletion failed").getUserMessage() });
                                });
        }
    }

    export default RentalsManager;




    function RentalsHeader(props){
        
        return <Row className="p-5 align-items-center justify-content-center">
                    <h1> Your Rentals </h1>
            </Row>;
    }

    /*
    * Displays the spinner while loading, and a message when no rentals have been booked yet
    */
    function NoResults(props){
    
        return <Row className="p-5 align-items-center justify-content-center">
                    { props.loading ? 
                        <Spinner animation="border" variant="info"/>
                        :
                        <Col>
                            <Row className="justify-content-center">
                                <h2> Looks like there are no rentals yet...</h2>
                            </Row>
                            <Row className="justify-content-center">
                                <Link to='/new-rental'>
                                    <h2> 
                                        Add a new one ! 
                                    </h2>
                                </Link>
                            </Row>
                        </Col>
                    }
            </Row>;
    }



