import React, { Component } from 'react';

class Footer extends Component {
    render(){
        return (
            <footer className={"footer" + (this.props.transparent !== undefined ? " footer-transparent":"")}>
                <div className={"container" + (this.props.fluid !== undefined ? "-fluid":"")}>
                    <nav className="pull-left">
                        <ul>
                            <li>
                                <a href="http://www.kit.edu.kh">
                                    Kirirom Institute of Technology
                                </a>
                            </li>
                        </ul>
                    </nav>
                    <p className="copyright pull-right">
                        &copy; {1900 + (new Date()).getYear()} <a href="http://www.kit.edu.kh">Kirirom Institute of Technology</a>, made with <i className="fa fa-heart heart"></i> for a better web
                    </p>
                </div>
            </footer>
        );
    }
}
export default Footer;
