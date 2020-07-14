
    import React from 'react';
    // React bootstrap
    import Navbar from 'react-bootstrap/Navbar';
    import Nav from 'react-bootstrap/Nav';
    //Router
    import {NavLink} from 'react-router-dom';
    // Icons
    import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
    import { faUserCircle } from '@fortawesome/free-regular-svg-icons'
    import { faCar } from '@fortawesome/free-solid-svg-icons'

    /*
    /* Navigation bar, on top of every page
    */
    function NavBar(props){
            
        return <Navbar bg="dark" variant="dark" sticky="top" className="py-0 justify-content-between">
                    <NavBrand/>
                    <NavGroup/>
                    <UserControls loggedIn={props.loggedIn} username={props.username} logout={props.logout}/>
            </Navbar>;
    }

    export default NavBar;

    /*
    * Car rental logo
    */
    function NavBrand(props){
        
        return <NavLink to="/"> 
                    <Navbar.Brand id="brand"> 
                        <FontAwesomeIcon icon={faCar} id="car-icon" className="mx-3"/>
                        <span> Car Rental </span>
                    </Navbar.Brand>
                </NavLink>
    }

    /*
    * Links to the various pages of the application
    */
    function NavGroup(props){
        
        return <Nav className="">
                    <NavLink to="/cars"       className="nav-link">      Cars       </NavLink>
                    <NavLink to="/new-rental" className="nav-link mx-3"> New Rental </NavLink>
                    <NavLink to="/rentals"    className="nav-link">      Rentals    </NavLink>
            </Nav>;
    }

    /*
    * Links to log in and out
    */
    function UserControls(props){
        
        return <Nav className="d-flex align-items-center">
                    { props.loggedIn ?
                        <>
                            <div className="mx-4 white-text"> 
                                <em>
                                    Welcome, {props.username} 
                                </em> 
                            </div>
                            <NavLink className="nav-link d-flex align-items-center" to='/login' onClick={ e => { e.preventDefault(); props.logout(); } }>
                                <div>
                                    Logout
                                </div>
                                <FontAwesomeIcon icon={faUserCircle} id="user-icon"/>
                            </NavLink>
                        </>
                            : 
                        <>
                            <NavLink className="nav-link d-flex align-items-center" to='/login'>
                                <div>Login</div>
                                <FontAwesomeIcon icon={faUserCircle} id="user-icon"/>
                            </NavLink>
                        </>
                    }
            </Nav>;
    }






