import React, { Component } from 'react';
import {
    Grid, Row, Col,
    FormGroup, ControlLabel, FormControl
} from 'react-bootstrap';

import Card from 'components/Card/Card.jsx';
import './login.css'

import Button from 'elements/CustomButton/CustomButton.jsx';
import {doSignInWithEmailAndPassword} from '../../firebase/auth';
import {getRef} from '../../firebase/database';
import {firebase} from '../../firebase';

const ERRORS = {
    "auth/user-not-found": "user not found!",
    "auth/wrong-password": "Invalid password!"
}

const byPropKey = (propertyName, value) => () => ({
    [propertyName]: value,
  });

class LoginPage extends Component{
    constructor(props){
        super(props);
        this.state = {
            cardHidden: true,
            emailError: '',
            passwordError: '',
            email: '',
            password: '',
            error: '',
        }
    }

    handleSubmit = () => {
        const {email, password, emailError, passwordError} = this.state;

        if(password === ""){
            this.setState(byPropKey("passwordError", "Password is required!"));
        }

        if(email === ""){
            this.setState(byPropKey("emailError", "Email is required!"));
        }

        if((emailError !== "") || (passwordError !== "") || (email === "") || (password === "")){
            return;
        }else {
            doSignInWithEmailAndPassword(email, password)
            .then(response => {
                getRef().child("Users").orderByChild("email").equalTo(response.email)
                .on("child_added", snapshot => {
                    if(snapshot.val().position === 1){
                        const {history} = this.props;
                        history.push("/");
                    }else{
                        firebase.auth.signOut();
                    }
                });
                
            }).catch(error => {
                let errormsg = ERRORS[error.code];
                this.setState(byPropKey('error', errormsg));
            })
        }

    }

    emailValidation = (email) => {
        // eslint-disable-next-line
        let pattern = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
        return pattern.test(email);
    }

    handleEmail = (e) => {
        let email = e.target.value;
        if (this.emailValidation(email)){
            this.setState({
                emailError: "",
                email: email,
            })
        }else if(email === ""){
            this.setState({
                emailError: "Email is required!",
                email: email
            })
        }
        else{
            this.setState({emailError: "please provide a valid email."})
        }
    }

    handlePassword = (e) => {
        let password = e.target.value;
        if(password === ""){
            this.setState({
                passwordError: "Password is required!",
                password: password
            })
        }else {
            this.setState({
                passwordError: "",
                password: password
            })
        }
    }

    componentDidMount(){
        setTimeout(function() { this.setState({cardHidden: false}); }.bind(this), 700);
    }

    render(){
        return (
            <Grid>
                <Row>
                    <Col md={4} sm={6} mdOffset={4} smOffset={3}>
                        <form>
                            <Card
                                hidden={this.state.cardHidden}
                                textCenter
                                title="Login"
                                content={
                                    <div>
                                        <span className="help-block text-center">{this.state.error}</span>
                                        <FormGroup>
                                            <ControlLabel>
                                                Email address
                                            </ControlLabel>
                                            <FormControl
                                                placeholder="Enter email"
                                                type="email"
                                                onChange={this.handleEmail}
                                            />
                                            <span className="help-block">{this.state.emailError}</span>
                                        </FormGroup>
                                        <FormGroup>
                                            <ControlLabel>
                                                Password
                                            </ControlLabel>
                                            <FormControl
                                                placeholder="Password"
                                                type="password"
                                                onChange={this.handlePassword}
                                            />
                                            <span className="help-block">{this.state.passwordError}</span>
                                        </FormGroup>
                                    </div>
                                }
                                legend={
                                    <Button bsStyle="info" fill wd onClick={()=> this.handleSubmit()}>
                                        Login
                                    </Button>
                                }
                                ftTextCenter
                            />
                        </form>
                    </Col>
                </Row>
            </Grid>
        );
    }
}

export default LoginPage;
