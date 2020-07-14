
    import React from 'react';
    // React bootstrap
    import Modal from 'react-bootstrap/Modal';
    import Button from 'react-bootstrap/Button';
    import Form from 'react-bootstrap/Form';

    import { SubmitButton, TextInput, NumberInput, ErrorMessage } from '../form/FormComponents';

    // Other modules
    import API from '../../data/API';

    import CarRentalException from '../../entity/CarRentalException';

    /*
     * Handles form and API call related to payment
     */
    class PaymentModal extends React.Component {
        
        constructor(props){
            super(props);
            this.state = {
                first: "",
                last:  "",
                number: "",
                CVV:  "",
                formValid: false,
                loading: false,
                error:   null
            };
        }
        
        render(){
            
            return <Modal centered show={this.props.show} onHide={this.props.onHide}>
                        
                        <Modal.Header closeButton>
                            <Modal.Title>Payment</Modal.Title>
                        </Modal.Header>
                        
                        <Modal.Body className="justify-content-center">
                            
                            <p className="text-center"> { "Amount: " + this.props.price +" €"} </p>
                            
                            <ModalForm first={this.state.first} last={this.state.last} number={this.state.number} CVV={this.state.CVV} updateField={this.updateField}/>
                            
                            { this.state.error && <ErrorMessage message={this.state.error}/> }
                            
                        </Modal.Body>
                        
                        <Modal.Footer className="align-items-center">
                            <Button variant="light" onClick={this.props.onHide}>
                                Undo Rental
                            </Button>
                            <SubmitButton label="Pay" variant="info" disabled={!this.state.formValid} loading={this.state.loading} onClick={ this.pay }/>
                        </Modal.Footer>
                
                </Modal>;
        }
        
        /*
         * Sets a new value for a form field
         */
        updateField = (name, value) => {

            this.setState({ [name]: value }, this.formValidation);
        }
        
        /*
         * Client-side form validation
         */
        formValidation = () => {
            
            this.setState({ formValid: this.state.first && this.state.last && this.state.number && this.state.CVV });
        }
        
        /*
         * API call for payment
         */
        pay = () => {
            this.setState({ loading: true });
            
            const paymentInfo = {
                rentalId: this.props.rentalId,
                number:   this.state.number,
                name:     this.state.first + " " + this.state.last,
                CVV:      this.state.CVV
                
            };
            
            API.payment(paymentInfo).then( () => {
                                        this.setState({ loading: false });
                                        this.props.onPaymentDone();
                                    })
                                    .catch( err => {
                                        console.error(err);
                                        this.setState({ loading: false, error: new CarRentalException(err, "Payment failed").getUserMessage });
                                    });
        }
    }

    export default PaymentModal;


    /*
     * Form inputs
     */
    function ModalForm(props){
        
        return <Form>
                    <TextInput   name="first"  label="First name"  value={props.first}  onChange={props.updateField} required={true} />
                    <TextInput   name="last"   label="Last name"   value={props.last}   onChange={props.updateField} required={true} />
                    <NumberInput name="number" label="Credit card" value={props.number} onChange={props.updateField} required={true} min={0}/>
                    <NumberInput name="CVV"    label="CVV"         value={props.CVV}    onChange={props.updateField} required={true} min={0}/>
            </Form>;
    }




