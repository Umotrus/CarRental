
    import React from 'react';
    // React bootstrap
    import Row from 'react-bootstrap/Row';
    // Components
    import LoginForm from './LoginForm';

    /*
    * Wraps the login page
    */
    function LoginManager(props){
            
            return (<Row className="d-flex justify-content-center p-5">
                        <LoginForm login={props.login} />
                </Row>);
        
    }

    export default LoginManager;
