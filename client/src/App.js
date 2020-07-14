import React from 'react';
import './App.css';

// Router
import {BrowserRouter as Router, Switch, Route, Redirect} from 'react-router-dom';

// Components
import Navbar         from './component/NavBar';
import LoginManager   from './component/login/LoginManager';
import CarsManager    from './component/cars/CarsManager';
import Configurator   from './component/configurator/Configurator';
import RentalsManager from './component/rentals/RentalsManager';
// Reac bootstrap
import 'bootstrap/dist/css/bootstrap.min.css';
import Container from 'react-bootstrap/Container';

// Other modules
import User from './entity/user';

import API from './data/API';

/*
 * Wraps the application, handle user information and login/logout
 */
class App extends React.Component {

    constructor(props){
        super(props);
        this.state = {
            loggedIn: false,
            user:     null
        }
    }
    
    componentDidMount = () => {
     
        // Log in automatically if the cookie is still valid
        API.getUser().then( u => {

                        this.setState({ loggedIn: true, user: u });
                    })
                    .catch( err => {
                        // Don't do anything, the user will be redirected to the login page automatically
                    });
    }
    
    render(){
        
        return <Container fluid className="p-0">
                    <Router>
                        <Navbar loggedIn={this.state.loggedIn} username={this.state.user && this.state.user.getUsername()} logout={this.logout}/>
                        <Switch>
                            
                            <Route exact path='/login'>
                                <LoginManager login={this.login}/>
                            </Route>
                            
                            <Route exact path='/cars'>
                                <CarsManager />
                            </Route>
                            
                            { this.state.loggedIn ? "" :  <Redirect to='/login' /> }
                            
                            <Route exact path='/rentals'>
                                <RentalsManager user={this.state.user && this.state.user.getId()}/>
                            </Route>
                            
                            <Route exact path='/new-rental'>
                                <Configurator/>
                            </Route>
                            
                            <Redirect to='/rentals'/>
                            
                        </Switch>
                    </Router>
               </Container>;
    }
    
    // Log in the user
    login = (username, password) => {
        
        const user = new User({ username: username, password: password });
        
        return API.login(user)
                    .then( u => {
                        this.setState({ loggedIn: true, user: u });
                        return u;
                    });
                    // Errors are catched in the login form component
    }
    
    // Log out
    logout = () => {
        
        API.logout().then( () => {
                        
                            this.setState({ loggedIn: false, user: null });
                    })
                    .catch( err => {
                        console.error(err);
                        alert("Logout failed");
                    });
    }
    
}

export default App;
