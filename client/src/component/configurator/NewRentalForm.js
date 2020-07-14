
    import React from 'react';
    // Moment
    import moment from 'moment';
    //React bootstrap
    import Container from 'react-bootstrap/Container';
    import Row       from 'react-bootstrap/Row';
    import Col       from 'react-bootstrap/Col';
    import Form      from 'react-bootstrap/Form';
    // Other modules
    import Rental from '../../entity/rental';
    import CarRentalException from '../../entity/CarRentalException';

    import API from '../../data/API';

    //Form components
    import { SelectInput, DateInput, NumberInput, CheckboxInput, SubmitButton, ErrorMessage } from '../form/FormComponents';

    /*
     * Manages the form to calculate the rental price and handles the needed API call
     */
    class NewRentalForm extends React.Component {
        
        constructor(props){
            super(props);
            this.state = {
                rental:         null,
                category:       "A",
                startDate:      "",
                endDate:        "",
                driverAge:      "",
                driversNumber:  1,
                kmPerDay:       "",
                extraInsurance: false,
                availableCars:  null,
                price:          null,
                errorMessage:   null,
                loading:        false
            };
        }
        
                
        render(){
            
            return <Container>
                        <InputFields category={this.state.category}
                                    startDate={this.state.startDate}
                                    endDate={this.state.endDate}
                                    driverAge={this.state.driverAge}
                                    driversNumber={this.state.driversNumber}
                                    kmPerDay={this.state.kmPerDay}
                                    extraInsurance={this.state.extraInsurance} 
                                    onChange={this.updateField}/>

                        <ResultsDisplayer disabled={!this.state.rental} cars={this.state.availableCars} price={this.state.price} loading={this.state.loading}/>
                        
                        { (this.props.errorMessage || this.state.errorMessage) && <ErrorMessage message={this.state.errorMessage || this.props.errorMessage}/> /* Errors in the Configurator are displayed here as well*/}
                        
                        <PaymentButton disabled={!this.state.rental || !this.state.availableCars} loading={this.props.loading} onClick={ this.submitForm }/>
                </Container>;
        }
        
        /*
         * Set a new value for a form field
         */
        updateField = (name, value) => {
            this.setState({ [name]: value, loading:true }, this.validateForm );
        }
        
        /*
         * Client side checks on the form
         */
        validateForm = () => {

            // Remove previous error messages
            this.setState({ errorMessage: null });
            
            try{
                // Two cases in which an error has to be displayed
                if(this.state.startDate && this.state.startDate < moment().format("YYYY-MM-DD")){
                    const err = { error: "Start date cannot be in the past" }
                    this.setState({ errorMessage: err.error });
                    throw err;
                }
                
                if(this.state.startDate && this.state.endDate && this.state.startDate > this.state.endDate){
                    const err = { error: "Start date cannot be after end date" }
                    this.setState({ errorMessage: err.error });
                    throw err;
                }
                
                // Constructor throws exceptions if needed
                const rental = new Rental(this.state);
                
                // Form is valid
                this.setState({ rental: rental, errorMessage: null}, this.getPrice)
                
            } catch(e){
                // Do not show errors from constructor exceptions
                this.setState({ rental: null, /*errorMessage: new CarRentalException(e.error,"Validation failed").getUserMessage(),*/ availableCars: null, price: null });
            }
        }
        
        /*
         * API call to calculate price and available cars
         */
        getPrice = () => {
            this.setState({ loading: true });
            
            API.getPriceAndCars(this.state.rental).then( obj => {
                                                        this.setState({ loading: false, availableCars: obj.cars, price: obj.price });
                                                    })
                                                    .catch( err => {
                                                        this.setState({ loading: false, rental: null, errorMessage: new CarRentalException(err, "Cannot retrieve price").getUserMessage() });
                                                    });
                    
        }
        
        /*
         * Send to the configurator the rental to be booked
         */
        submitForm = () => {
                
            const rental = new Rental({...this.state.rental});
                
            rental.setPrice(this.state.price);
            
            this.props.onSubmit(rental);
        }
    }

    export default NewRentalForm;


    /*
     * Form inputs
     */
    function InputFields(props){
        
        return <Row className="mt-5 mb-2 justify-content-center">
                    <Form>
                        <Row>
                            <Col>
                                <DateInput   name="startDate" value={props.startDate} label="Start Date"   required={true} onChange={props.onChange} />
                            </Col>
                            <Col>
                                <DateInput   name="endDate"   value={props.endDate}   label="End Date"     required={true} onChange={props.onChange} />
                            </Col>
                            <Col className="col-2">
                            <SelectInput name="category"  value={props.category}  label="Car category" required={true} onChange={props.onChange} options={["A","B","C","D","E"]} />
                            </Col>
                        </Row>
                        <Row>
                            <Col>
                                <NumberInput name="driverAge" value={props.driverAge} label="Driver age"   required={true} onChange={props.onChange} min={18}/>
                            </Col>
                            <Col>
                                <NumberInput name="driversNumber" value={props.driversNumber} label="Drivers"   required={true} onChange={props.onChange} min={1}/>
                            </Col>
                            <Col>
                                <NumberInput name="kmPerDay" value={props.kmPerDay} label="Km per day"   required={true} onChange={props.onChange} min={0}/>
                            </Col>
                            <Col className="col-2">
                                <CheckboxInput name="extraInsurance" value={props.extraInsurance} label="Extra insurance" onChange={props.onChange} />
                            </Col>
                        </Row>
                    </Form>
            </Row>;
    }


    /*
     * Displays price and available cars
     */
    function ResultsDisplayer(props){
        
        return <Row className="justify-content-around m-5 rounded border bg-light">
                    <NumberDisplayer label="Available cars: " show={!props.disabled}               value={props.cars }        loading={props.loading} />
                    <NumberDisplayer label="Price: "          show={!props.disabled && props.cars} value={props.price + ' €'} loading={props.loading} />
            </Row>;
    }

    /*
     * Form submission button
     */
    function PaymentButton(props){
        
        return <Row className="justify-content-center align-items-center">
                    <SubmitButton label="Confirm and pay" variant="info" disabled={props.disabled} loading={props.loading} onClick={props.onClick}/>
            </Row>;
    }

    function NumberDisplayer(props){
    
        return <div className="d-inline p-2 text-info">
                    <h3 className="d-inline my-auto">
                        { props.label }
                    </h3>
                    <h4 className="d-inline ml-2 text-success">
                        { props.show && props.value }
                    </h4>
            </div>
    }

