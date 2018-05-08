import React, { Component } from 'react';
import {
   Nav, NavDropdown, MenuItem
} from 'react-bootstrap';

import {firebase} from '../../firebase';

class HeaderLinks extends Component{

    handleLogout = (e) => {
        console.log("I am going to logout.");
        firebase.auth.signOut()
        .then(response => console.log(response))
        .catch(error => console.log(error));
    }

    render(){
        return(
            <div>
                <Nav pullRight>
                    <NavDropdown
                        eventKey={2}
                        title={(
                            <div>
                                <i className="fa fa-user"></i>
                                <p>
                                    Admin
                                    <b className="caret"></b>
                                </p>
                            </div>
                        )} noCaret id="basic-nav-dropdown-1">
                        <MenuItem eventKey={2.1} onClick={this.handleLogout}>logout</MenuItem>
                    </NavDropdown>
                </Nav>
            </div>
        );
    }
}
export default HeaderLinks;
