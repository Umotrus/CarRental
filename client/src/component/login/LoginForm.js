

    import React from 'react';
    // Router
    import { Redirect } from 'react-router-dom';
    // React bootstrap
    import Card    from 'react-bootstrap/Card';
    import Form    from 'react-bootstrap/Form';
    // Form components
    import { ErrorMessage, TextInput, PasswordInput, SubmitButton } from '../form/FormComponents';
    // Other modules
    import CarRentalException from '../../entity/CarRentalException';

    /*
    * Manages the form where the user inserts username and password
    */
    class LoginForm extends React.Component {

        constructor(props){
            super(props);
            this.state = { 
                username:     "",
                password:     "",
                loggedIn:     false,
                loading:      false,
                errorMessage: null
            };
        }
        
        render(){
            
            if(this.state.loggedIn)
                return <Redirect to='/'/>; // When login is complete, go to the homepage
            
            return <Card>
                        <Card.Body>
                        
                            <Card.Title className="text-center mb-3">
                                Login
                            </Card.Title>
                            
                            <Form>
                                <TextInput      name="username" value={this.state.username} onChange={this.updateField} label="Username" required={true} />
                                <PasswordInput  name="password" value={this.state.password} onChange={this.updateField} label="Password" required={true} />
                                
                                { this.state.errorMessage && <ErrorMessage message={this.state.errorMessage} /> }
                                
                                <SubmitButton className="mb-0 mt-2" label="Login" onClick={this.tryLogin} loading={this.state.loading} variant="info"/>
                            </Form>
                        
                        </Card.Body>
                </Card>;
        }
        
        /*
        * Sets a new value for a field
        */
        updateField = (name, value) => {
            this.setState({ [name]: value });
        }
        
        /*
        * Calls the login function from the App component
        */
        tryLogin = () => {
            this.setState({ loading: true, errorMessage: null });
            
            // Check if both values are present
            if( !this.state.username || !this.state.password )
                return this.setState({ loading: false, errorMessage: "Please fill out both username and password"});
            
            // Try to log in
            this.props.login(this.state.username, this.state.password)
                                    .then( () => {
                                        this.setState({ loggedIn:true, errorMessage: null, loading: false })
                                    })
                                    .catch( err => {
                                        this.setState({ loading: false, errorMessage: new CarRentalException(err, "Login failed").getUserMessage() });
                                    });
        }
        
    }

    export default LoginForm;







