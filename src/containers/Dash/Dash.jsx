import React, {Component} from 'react';
import {
    Switch,
    Route,
    Redirect
} from 'react-router-dom';
// this is used to create scrollbars on windows devices like the ones from apple devices
import * as Ps from 'perfect-scrollbar';
import 'perfect-scrollbar/dist/css/perfect-scrollbar.min.css';

import Sidebar from '../../components/Sidebar/Sidebar.jsx';
import Header from '../../components/Header/Header.jsx';
import Footer from '../../components/Footer/Footer.jsx';

// dinamically create dashboard routes
import {NonAuthenticateRoute, AuthenticatedRoute} from '../../routes/dash.jsx';
import {firebase} from '../../firebase';

class Dash extends Component{
    
    constructor(props) {
        super(props);
        this.state = {
            authUser: null,
            AppRoute: undefined
        }
    }

    componentDidMount(){
        if (window.matchMedia(`(min-width: 960px)`).matches && !this.isMac()) {
            Ps.initialize(this.refs.mainPanel, { wheelSpeed: 2, suppressScrollX: true });
        }
        firebase.auth.onAuthStateChanged(authUser => {
            authUser
                ? this.setState({authUser, AppRoute: AuthenticatedRoute()})
                : this.setState({authUser: null, AppRoute: NonAuthenticateRoute()});
            });
    }
    
    // function that creates perfect scroll bar for windows users (it creates a scrollbar that looks like the one from apple devices)
    isMac(){
        let bool = false;
        if (navigator.platform.toUpperCase().indexOf('MAC') >= 0 || navigator.platform.toUpperCase().indexOf('IPAD') >= 0) {
            bool = true;
        }
        return bool;
    }
    componentDidUpdate(e){
        if (window.matchMedia(`(min-width: 960px)`).matches && !this.isMac()) {
            setTimeout(() => { 
                if(this.refs.mainPanel){
                    Ps.update(this.refs.mainPanel);
                }
             }, 2000);
        }
        if(e.history.action === "PUSH"){
            this.refs.mainPanel.scrollTop = 0;
        }
    }
    componentWillMount(){
        if(document.documentElement.className.indexOf('nav-open') !== -1){
            document.documentElement.classList.toggle('nav-open');
        }
    }
    render(){
        return (
            <div className="wrapper">
                <Sidebar {...this.props} />
                <div className={"main-panel"+(this.props.location.pathname === "/maps/full-screen-maps" ? " main-panel-maps":"")} ref="mainPanel">
                    <Header {...this.props}/>
                        <Switch>
                            {
                                this.state.AppRoute?(
                                    this.state.AppRoute.map((prop,key) => {
                                        if(prop.collapse){
                                            return prop.views.map((prop,key) => {
                                                return (
                                                    <Route path={prop.path} component={prop.component} key={key}/>
                                                );
                                            })
                                        } else {
                                            if(prop.redirect)
                                                return (
                                                    <Redirect from={prop.path} to={prop.pathTo} key={key}/>
                                                );
                                            else
                                                return (
                                                    <Route path={prop.path} component={prop.component} key={key}/>
                                                );
                                        }
                                    })
                                ):null
                            }
                        </Switch>
                    <Footer fluid/>
                </div>
            </div>
        );
    }
}

export default Dash;
