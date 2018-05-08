import React, { Component } from 'react';
import {
    Grid, Row, Col,
    Nav, NavItem,
    Tab, Table, Modal,
    FormGroup, ControlLabel, FormControl
} from 'react-bootstrap';
// react component that creates a dropdown menu for selecting a date
import Datetime from 'react-datetime';
import StarRatings from 'react-star-ratings';
import moment from 'moment';
import Masonry from 'react-masonry-component';
import Button from 'elements/CustomButton/CustomButton.jsx';
import SweetAlert from 'react-bootstrap-sweetalert';
import Card from 'components/Card/Card.jsx';
import Radio from 'elements/CustomRadio/CustomRadio.jsx';
import {createFlow, getFlows, deleteFlow, updateFlow, 
        createUser, getUsers, deleteUser, updateUser,
        createTask, getTasks, deleteTask, updateTask,
        getReviews, managerReview} from '../../firebase/database.js';

let INITIALIZEFLOW = {
    data: "",
    id: "",
    datas: [],
    error: "",
    showModal: false,
    update: false,
    alert: null
}

let INITIALIZEUSER = {
    name: "",
    email: "",
    role: "1",
    id: "",
    datas: [],
    error: "",
    showModal: false,
    update: false,
    alert: null
}

let INITIALIZETASK = {
    name: "",
    flow: "",
    id: "",
    datas: [],
    showModal: false,
    update: false,
    alert: null,
    flows: [],
    nameError: "",
    flowError: ""
}

const INITIALIZEREVIEW = {
    date: null,
    reviews: [],
    rating: null,
    m_rating: null,
    review_date: null,
    id: null,
    manager: null,
    user: null
}

const ROLES = {
    "1": "Admin",
    "2": "Manager",
    "3": "User"
}

const masonryOptions = {
    transitionDuration: 0
};

class Department extends Component {

    constructor(props) {
        super(props);
        this.state = {
            flow: {...INITIALIZEFLOW},
            user: {...INITIALIZEUSER},
            task: {...INITIALIZETASK},
            review: {...INITIALIZEREVIEW},
            department: ""
        }
    }

    componentDidUpdate(e){
        if (window.matchMedia(`(min-width: 960px)`).matches && !this.isMac()) {
            this._reactInternalInstance._currentElement._owner._instance._reactInternalInstance._currentElement._owner._instance.componentDidUpdate(e);
        }
    }
    isMac(){
        let bool = false;
        if (navigator.platform.toUpperCase().indexOf('MAC') >= 0 || navigator.platform.toUpperCase().indexOf('IPAD') >= 0) {
            bool = true;
        }
        return bool;
    }

    handleFlowShow = () => {
        let appState = this.state.flow
        appState.showModal = true
        this.setState({
            flow: {...appState}
        });
    }

    handleFlowHide = () => {
        let appState = this.state.flow;
        appState.showModal = false;
        appState.data = "";
        appState.error = "";
        appState.update = false;
        appState.id = "";

        this.setState({
            flow: {...appState}
        });

    }

    handleFlowChange = (e) => {
        let text = e.target.value;
        let appState = this.state.flow;
        if(text === ""){
            appState.error = "flow is required!";
            appState.data = "text";
            this.setState({
                flow: {...appState}
            }, ()=> console.log(this.state.flow))
        }else{
            appState.error = "";
            appState.data = text;
            this.setState({
                flow: {...appState}
            });
        }
    }

    handleFlowSubmit = () => {
        const {data} = this.state.flow;
        const {department} = this.state;
        if (data !== ""){
            createFlow(department, data)
            .then(response => {
                let appState = this.state.flow;
                appState.alert = (
                    <SweetAlert
                        success
                        style={{display: "block",marginTop: "-100px"}}
                        title="Added!"
                        onConfirm={() => this.hideFlowAlert()}
                        onCancel={() => this.hideFlowAlert()}
                        showConfirm={false}
                    >
                        Your flow has been added.
                    </SweetAlert>
                );
                appState.data = "";
                this.setState({
                    flow: {...appState}
                });
                setTimeout(()=> {
                    appState.alert = null;
                    this.setState({
                        flow: {...appState}
                    })
                }, 2000);
            })
            .catch(error => {
                let appState = this.state.flow;
                appState.alert = (
                    <SweetAlert
                        danger
                        style={{display: "block",marginTop: "-100px"}}
                        title="Added!"
                        onConfirm={() => this.hideFlowAlert()}
                        onCancel={() => this.hideFlowAlert()}
                        showConfirm={false}
                    >
                        Your credo did not add.
                    </SweetAlert>
                )
                this.setState({
                    flow: {...appState}
                });
                setTimeout(()=> {
                    appState.alert = null;
                    this.setState({
                        flow: {...appState}
                    })
                }, 2000);
            });
        }else{
            const flowState = this.state.flow;
            flowState.error = "Flow is required!";
            this.setState({
                flow: {...flowState}
            })
        }
    }

    handleFlowEdit = (e) => {
        const text = e.target.name;
        let flow = text.substring(0, text.indexOf(":"));
        let id = text.substring(text.indexOf(":")+1);
        let appState = this.state.flow;
        appState.data = flow;
        appState.id = id;
        appState.showModal = true;
        appState.update = true;
        this.setState({
            flow: {...appState}
        });
    }

    updateFlow = () => {
        const {data, id} = this.state.flow;
        if (data !== ""){
            updateFlow(id, data).then(response => {
                if(response) {
                    let appState = this.state.flow;
                    appState.alert = (
                        <SweetAlert
                            success
                            style={{display: "block",marginTop: "-100px"}}
                            title="Updated!"
                            onConfirm={() => this.hideFlowAlert()}
                            onCancel={() => this.hideFlowAlert()}
                            showConfirm={false}
                        >
                            Your flow has been updated.
                        </SweetAlert>
                    );
                    this.setState({
                        flow: {...appState}
                    });
                    setTimeout(()=> {
                        appState.alert = null;
                        this.setState({
                            flow: {...appState}
                        });
                        this.fetchFlows(this.state.department);
                    }, 2000);
                }
            })
        }else{
            let appState = this.state.flow;
            appState.error = 'flow is required!';
            this.setState({
                flow: {...appState}
            });
        }
    }

    handleFlowDelete = (e) =>{
        const id = e.target.name;
        let appState = this.state.flow;
        appState.alert = (
            <SweetAlert
                warning
                style={{display: "block",marginTop: "-100px"}}
                title="Are you sure?"
                onConfirm={() => this.deleteFlow(id)}
                onCancel={() => this.hideFlowAlert()}
                confirmBtnBsStyle="info"
                cancelBtnBsStyle="danger"
                confirmBtnText="Yes, delete it!"
                cancelBtnText="Cancel"
                showCancel
            >
                You will not be able to recover this flow!
            </SweetAlert>
        );
        this.setState({
            flow: {...appState}
        });
    }

    deleteFlow(id) {
        deleteFlow(id).then(response => {
            if(response){
                let appState = this.state.flow;
                appState.alert = (
                    <SweetAlert
                        success
                        style={{display: "block",marginTop: "-100px"}}
                        title="Deleted!"
                        onConfirm={() => this.hideFlowAlert()}
                        onCancel={() => this.hideFlowAlert()}
                        showConfirm={false}
                    >
                        Your flow has been deleted.
                    </SweetAlert>
                );
                this.setState({
                    flow: {...appState}
                });
                setTimeout(()=>{
                    this.handleFlowHide();
                    this.fetchFlows(this.state.department);
                }, 2000);
            }
        })
    }

    hideFlowAlert = () => {
        let appState = this.state.flow;
        appState.alert = null;
        this.setState({
            flow: {...appState}
        });
    }

    /* Start User Function */

    hideUserAlert = () => {
        let appState = this.state.user;
        appState.alert = null;
        this.setState({
            user: {...appState}
        });
    }

    handleUserShow = () => {
        let appState = this.state.user;
        appState.showModal = true;
        this.setState({
            user: {...appState}
        });
    }

    handleUserHide = () => {
        let appState = this.state.user;
        appState.showModal = false;
        appState.update = false;
        appState.error = "";
        appState.name = "";
        appState.role = "1";
        appState.id = "";
        appState.email = "";
        appState.emailerror = "";
        appState.nameerror ="";
        this.setState({
            user: {...appState}
        });
    }

    handleRadio = event => {
        const text = event.target.value;
        let appState = this.state.user;
        appState.role = text;
        this.setState({
            user: {...appState}
        });
    }

    handleUsername = event => {
        const text = event.target.value;
        let appState = this.state.user;
        if(text === ""){
            appState.name = text;
            appState.nameerror = "username is required!"
            this.setState({
                user: {...appState}
            });
        }else{
            appState.name = text;
            appState.nameerror = "";
            this.setState({
                user: {...appState}
            });
        }
    }

    emailValidation = (email) => {
        // eslint-disable-next-line
        let pattern = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
        return pattern.test(email);
    }

    handleUserEmail = event => {
        const text = event.target.value;
        let appState = this.state.user;
        if (this.emailValidation(text)){
            appState.email = text;
            appState.emailerror = "";
            this.setState({
                user: {...appState}
            });
        }else if(text === ""){
            appState.emailerror = "email is required!";
            appState.email = text;
            this.setState({
                user: {...appState}
            });
        }
        else{
            appState.emailerror = "please provide a valid email.";
            appState.email = text;
            this.setState({
                user: {...appState}
            });
        }
    }

    handleUserSubmit = () => {
        const {name, email, role} = this.state.user;
        const {department} = this.state;
        let appState = this.state.user;
        if(name === "") {
            appState.nameerror = "username is required!";
            this.setState({
                user: {...appState}
            });
        }

        if(email === "") {
            appState.emailerror = "email is required";
            this.setState({
                user: {...appState}
            });
        }

        if((name === "") || (email === "") || !this.emailValidation(email)){
            return;
        }else{
            createUser(department, name, email, role)
            .then(response => {
                appState.alert = (
                    <SweetAlert
                        success
                        style={{display: "block",marginTop: "-100px"}}
                        title="Added!"
                        onConfirm={() => this.hideUserAlert()}
                        onCancel={() => this.hideUserAlert()}
                        showConfirm={false}
                    >
                        Your credo has beed added.
                    </SweetAlert>
                );
                this.setState({
                    user: {...appState}
                });
                setTimeout(this.hideUserAlert, 2000);
            }).catch(error => {
                appState.alert = (
                    <SweetAlert
                        danger
                        style={{display: "block",marginTop: "-100px"}}
                        title="Added!"
                        onConfirm={() => this.hideUserAlert()}
                        onCancel={() => this.hideUserAlert()}
                        showConfirm={false}
                    >
                        Your credo did not add.
                    </SweetAlert>
                );
                this.setState({
                    user: {...appState}
                });
                setTimeout(this.hideUserAlert, 2000);
            })
        }
    }

    handleUserDelete = event => {
        const id = event.target.name;
        let appState = this.state.user;
        appState.alert = (
            <SweetAlert
                warning
                style={{display: "block",marginTop: "-100px"}}
                title="Are you sure?"
                onConfirm={() => this.deleteUser(id)}
                onCancel={() => this.hideUserAlert()}
                confirmBtnBsStyle="info"
                cancelBtnBsStyle="danger"
                confirmBtnText="Yes, delete it!"
                cancelBtnText="Cancel"
                showCancel
            >
                You will not be able to recover this User!
            </SweetAlert>
        );
        this.setState({
            user: {...appState}
        });
    }

    deleteUser = id => {
        deleteUser(id).then(response => {
            if (response){
                let appState = this.state.user;
                appState.alert = (
                    <SweetAlert
                        success
                        style={{display: "block",marginTop: "-100px"}}
                        title="Deleted!"
                        onConfirm={() => this.hideUserAlert()}
                        onCancel={() => this.hideUserAlert()}
                        showConfirm={false}
                    >
                        Your User has been deleted.
                    </SweetAlert>
                );
                this.setState({
                    user: {...appState}
                });
                setTimeout(() => {
                    this.hideUserAlert();
                    this.fetchUsers(this.state.department);
                }, 2000);
            }
        }).catch(error => {
            let appState = this.state.user;
            appState.alert = (
                <SweetAlert
                    danger
                    style={{display: "block",marginTop: "-100px"}}
                    title="Failed"
                    onConfirm={() => this.hideUserAlert()}
                    onCancel={() => this.hideUserAlert()}
                    showConfirm={false}
                >
                    Your user did not delete :)
                </SweetAlert>
            );
            this.setState({
                user: {...appState}
            });
            setTimeout(this.hideUserAlert, 2000);
        })
    }

    handleUserEdit = event => {
        const key = parseInt(event.target.name, 10);
        let user = this.state.user.datas[key];
        let appState = this.state.user;
        appState.role = user.position;
        appState.name = user.name;
        appState.email = user.email;
        appState.update = true;
        appState.id = user.id;
        appState.showModal = true;
        this.setState({
            user: {...appState}
        });
    }

    handleUserUpdate = () => {
        let {role, name, id} = this.state.user;
        if(name !== ""){
            updateUser(id, name, role).then(response => {
                if(response) {
                    let appState = this.state.user;
                    appState.alert = (
                        <SweetAlert
                            success
                            style={{display: "block",marginTop: "-100px"}}
                            title="Updated!"
                            onConfirm={() => this.hideUserAlert()}
                            onCancel={() => this.hideUserAlert()}
                            showConfirm={false}
                        >
                            Your user has been updated.
                        </SweetAlert>
                    );
                    this.setState({
                        user: {...appState}
                    });
                    setTimeout(() => {
                        this.hideUserAlert();
                        this.fetchUsers(this.state.department);   
                    }, 2000);
                }
            }).catch(error => {
                let appState = this.state.user;
                appState.alert = (
                    <SweetAlert
                        danger
                        style={{display: "block",marginTop: "-100px"}}
                        title="Failed!"
                        onConfirm={() => this.hideUserAlert()}
                        onCancel={() => this.hideUserAlert()}
                        showConfirm={false}
                    >
                        Your user did not update.
                    </SweetAlert>
                );
                this.setState({
                    user: {...appState}
                });
                setTimeout(this.hideUserAlert, 2000);
            })
        }else{
            let appState = this.state.user;
            appState.nameerror = 'username is required!';
            this.setState({
                user: {...appState}
            });
            return;
        }
    }

    /* End User Function */

    /*********** Start Task Function ************/

    handleTaskShow = () => {
        let appState = this.state.task;
        appState.showModal = true;
        this.setState({
            task: {...appState}
        });
    }

    handleTaskHide = () => {
        let appState = this.state.task;
        appState.showModal = false;
        appState.name = "";
        appState.flow = "";
        appState.id = "";
        appState.nameError = "";
        appState.flowError = "";
        appState.update = false;
        this.setState({
            task: {...appState}
        });
    }

    hideTaskAlert = () => {
        let appState = this.state.task;
        appState.alert = null;
        this.setState({
            task: {...appState}
        });
    }

    handleTaskChange = event => {
        const text = event.target.value;
        let appState = this.state.task;
        if(text === ""){
            appState.nameError = 'task is required!';
            appState.name = text;
            this.setState({
                task: {...appState}
            });
        }else{
            appState.nameError = "";
            appState.name = text;
            this.setState({
                task: {...appState}
            });
        }
    }

    handleFlowSelection = event => {
        const flow = event.target.value;
        let appState = this.state.task;

        if(flow === ""){
            appState.flowError = "flow is required!";
            appState.flow = flow;
            this.setState({
                task: {...appState}
            });
        }else{
            appState.flowError = "";
            appState.flow = flow;
            this.setState({
                task: {...appState}
            });
        }
    }

    handleTaskSubmit = () => {
        const {name, flow} = this.state.task;
        const {department} = this.state;
        let appState = this.state.task;
        
        if(name === "") {
            appState.nameError = "task is required!";
            this.setState({
                task: {...appState}
            });
        }
        if(flow === ""){
            appState.flowError = "flow is required!";
            this.setState({
                task: {...appState}
            });
        }
        if(name === ""||flow === ""){
            return;
        }else{
            createTask(department, name, flow)
            .then(response => {
                appState.alert = (
                    <SweetAlert
                        success
                        style={{display: "block",marginTop: "-100px"}}
                        title="Added!"
                        onConfirm={() => this.hideTaskAlert()}
                        onCancel={() => this.hideTaskAlert()}
                        showConfirm={false}
                    >
                        Your task has beed added.
                    </SweetAlert>
                );
                this.setState({
                    task: {...appState}
                });
                setTimeout(this.hideTaskAlert, 2000);
            }).catch(error => {
                appState.alert = (
                    <SweetAlert
                        danger
                        style={{display: "block",marginTop: "-100px"}}
                        title="Failed!"
                        onConfirm={() => this.hideTaskAlert()}
                        onCancel={() => this.hideTaskAlert()}
                        showConfirm={true}
                    >
                        Your task has beed added.
                    </SweetAlert>
                );
                this.setState({
                    task: {...appState}
                });
            });
        }
    }

    handleTaskDelete = event => {
        const id = event.target.name;
        let appState = this.state.task;
        appState.alert = (
            <SweetAlert
                warning
                style={{display: "block",marginTop: "-100px"}}
                title="Are you sure?"
                onConfirm={() => this.deleteTask(id)}
                onCancel={() => this.hideTaskAlert()}
                confirmBtnBsStyle="info"
                cancelBtnBsStyle="danger"
                confirmBtnText="Yes, delete it!"
                cancelBtnText="Cancel"
                showCancel
            >
                You will not be able to recover this task!
            </SweetAlert>
        );
        this.setState({
            task: {...appState}
        });
    }

    deleteTask = id => {
        deleteTask(id).then(response => {
            if(response) {
                let appState = this.state.task;
                appState.alert = (
                    <SweetAlert
                        success
                        style={{display: "block",marginTop: "-100px"}}
                        title="Deleted!"
                        onConfirm={() => this.hideTaskAlert()}
                        onCancel={() => this.hideTaskAlert()}
                        showConfirm={false}
                    >
                        Your Task has been deleted.
                    </SweetAlert>
                );
                this.setState({
                    task: {...appState}
                });
                setTimeout(() => {
                    this.hideTaskAlert();
                    this.fetchTasks(this.state.department);
                }, 2000);
            }
        }).catch(error => {
            let appState = this.state.task;
            appState.alert = (
                <SweetAlert
                    danger
                    style={{display: "block",marginTop: "-100px"}}
                    title="Failed!"
                    onConfirm={() => this.hideTaskAlert()}
                    onCancel={() => this.hideTaskAlert()}
                    showConfirm={false}
                >
                    Your Task did not delete!.
                </SweetAlert>
            );
            this.setState({
                task: {...appState}
            });
            setTimeout(this.hideTaskAlert, 2000);
        });
    }

    handleTaskEdit = event => {
        let appState = this.state.task;
        const key = parseInt(event.target.name, 10);
        const currentTask = this.state.task.datas[key];
        appState.update = true;
        appState.id = currentTask.id;
        appState.name = currentTask.name;
        appState.flow = currentTask.flow;
        appState.showModal = true;
        this.setState({
            task: {...appState}
        });
    }

    updateTask = () => {
        const {id, name, flow} = this.state.task;
        let appState = this.state.task;
        if(name !== "" && flow !== ""){
            updateTask(id, name, flow)
            .then(response => {
                if(response){
                    appState.alert = (
                        <SweetAlert
                            success
                            style={{display: "block",marginTop: "-100px"}}
                            title="Updated!"
                            onConfirm={() => this.hideTaskAlert()}
                            onCancel={() => this.hideTaskAlert()}
                            showConfirm={false}
                        >
                            Your task has been updated.
                        </SweetAlert>
                    );
                    this.setState({
                        task: {...appState}
                    });
                    setTimeout(() => {
                        this.hideTaskAlert();
                        this.fetchTasks(this.state.department);   
                    }, 2000);
                }
            }).catch(error => {
                appState.alert = (
                    <SweetAlert
                        danger
                        style={{display: "block",marginTop: "-100px"}}
                        title="Failed!"
                        onConfirm={() => this.hideTaskAlert()}
                        onCancel={() => this.hideTaskAlert()}
                        showConfirm={false}
                    >
                        Your task did not update.
                    </SweetAlert>
                );
                this.setState({
                    task: {...appState}
                });
                setTimeout(this.hideTaskAlert, 2000);
            });
        }else{
            return;
        }
    }

    /*********** End Task Function ************/

    /*********** Start Review Function ***********/

    handleUserChange = event => {
        const text = event.target.value;
        let appState = this.state.review;
        appState.user = text;
        this.setState({
            review: {...appState}
        }, () => {
            this.fetchReviews(this.state.department, this.state.review.user, this.state.review.date);
        });
    }

    handleDateChange = (date) => {
        let appState = this.state.review;
        appState.date = date.format("DD/MM/YYYY");
        this.setState({
            review: {...appState}
        }, ()=> {
           this.fetchReviews(this.state.department, this.state.review.user, this.state.review.date);
        });
    }

    handleManagerRate = (rating, rateID, key) => {
        let appState = this.state.review;
        appState.reviews[key].managerRate = rating;
        this.setState({
            review: {...appState}
        }, () => {
            managerReview(rating, rateID);
        });
    }

    /*********** End Review Function *************/

    fetchUsers = depID => {
        getUsers(depID).then(response => {
            if(response){
                let appState = this.state.user;
                appState.datas = response;
                this.setState({
                    user: {...appState}
                })
            }
        }).catch(error => console.log(error));
    }

    fetchFlows = depID => {
        getFlows(depID).then(response => {
            if(response){
                let appState = this.state.flow;
                appState.datas = response;
                this.setState({
                    flow: {...appState}
                });
            }
        }).catch(error => console.log(error));
    }

    fetchTasks = depID => {
        let appState = this.state.task;
        getTasks(depID).then(response => {
            appState.datas = response;
            this.setState({
                task: {...appState}
            });
        }).catch(error => {
            console.log(error);
        });
    }

    fetchReviews = (department, user, date) => {
        let appState = this.state.review;
        getReviews(department, user, date).then(response => {
            appState.reviews = response;
            this.setState({
                review: appState
            });
        }).catch(error => {
            console.log(error);
        });
    }

    componentDidMount() {
        const {match} = this.props;
        const text = match.path;
        const url = text.substring(text.indexOf("/")+1);
        const depID = url.substring(url.indexOf("/") + 1);
        let appState = this.state.review;
        appState.date = moment().format('DD/MM/YYYY');
        this.setState({
            department: depID,
            review: {...appState}
        },() => {
            this.fetchFlows(this.state.department);
            this.fetchUsers(this.state.department);
            this.fetchTasks(this.state.department);
            this.fetchReviews(this.state.department, this.state.review.user, this.state.review.date);
        });
    }

    render() {

        const ReviewCard = this.state.review.reviews.map((item, key) => {
            return (
                <Col md={4} sm={6} key={key}>
                    <Card
                        title= {item.name}
                        category={item.date}
                        textCenter={true}
                        ctTextCenter={true}
                        content={
                            <div>
                                <StarRatings
                                    rating={item.rating}
                                    isSelectable={false}
                                    starDimension="40px"
                                    starSpacing="0px"
                                    starRatedColor="rgb(255, 169, 27)"
                                    starHoverColor="rgb(255, 169, 27)"
                                />
                            </div>
                        }
                        legend={
                            <div className="text-center">
                                <p>Manager Review</p>
                                <StarRatings
                                    rating={item.managerRate}
                                    isSelectable={false}
                                    changeRating={(rating) => this.handleManagerRate(rating, item.id, key)}
                                    starDimension="40px"
                                    starSpacing="0px"
                                    starRatedColor="rgb(255, 169, 27)"
                                    starHoverColor="rgb(255, 169, 27)"
                                />
                            </div>
                        }
                        stats={
                            <div><i className="fa fa-user"></i>{item.username}</div>
                        }
                    />
                </Col>
            )
        });

        const Flowtable = (
            <Table striped responsive>
                <thead>
                    <tr>
                        <th className="text-center">#</th>
                        <th>Name</th>
                        <th className="text-right">Action</th>
                        <th className="text-right"><Button bsStyle="primary" fill onClick={this.handleFlowShow}>ADD</Button></th>
                    </tr>
                </thead>
                <tbody>
                    {
                        this.state.flow.datas.map((item, key) => {
                            return(
                                <tr key={key}>
                                    <td className="text-center">{key +1}</td>
                                    <td>{item.name}</td>
                                    <td className="text-center" colSpan="2">
                                        <Button bsStyle="info" fill name={item.name+":"+item.id} onClick={this.handleFlowEdit}>Edit</Button>
                                        <Button bsStyle="danger" fill name={item.id} onClick={this.handleFlowDelete}>Delete</Button>
                                    </td>
                                </tr>
                            );
                        })
                    }
                </tbody>
            </Table>
        );

        const UserTable = (
            <Table striped responsive>
                <thead>
                    <tr>
                        <th className="text-center">#</th>
                        <th>Name</th>
                        <th>Email</th>
                        <th className="text-center">Role</th>
                        <th className="text-right"><Button bsStyle="primary" fill onClick={this.handleUserShow}>ADD</Button></th>
                    </tr>
                </thead>
                <tbody>
                    {
                        this.state.user.datas.length>0?(
                            this.state.user.datas.map((item, key) => {
                                return(
                                    <tr key={key}>
                                        <td className="text-center">{key +1}</td>
                                        <td>{item.name}</td>
                                        <td>{item.email}</td>
                                        <td>{ROLES[item.position]}</td>
                                        <td className="text-center" colSpan="2">
                                            <Button bsStyle="info" fill name={key} onClick={this.handleUserEdit}>Edit</Button>
                                            <Button bsStyle="danger" fill name={item.id} onClick={this.handleUserDelete}>Delete</Button>
                                        </td>
                                    </tr>
                                );
                            })
                        ):null
                    }
                </tbody>
            </Table>
        );

        const TasksTablse = (
            <Table striped responsive>
                <thead>
                    <tr>
                        <th className="text-center">#</th>
                        <th>Name</th>
                        <th>Flow</th>
                        <th className="text-center"><Button bsStyle="primary" fill onClick={this.handleTaskShow}>ADD</Button></th>
                    </tr>
                </thead>
                <tbody>
                    {
                        this.state.task.datas.length>0?(
                            this.state.task.datas.map((item, key) => {
                                return(
                                    <tr key={key}>
                                        <td className="text-center">{key +1}</td>
                                        <td>{item.name}</td>
                                        <td>{item.flowName}</td>
                                        <td className="text-center" colSpan="2">
                                            <Button bsStyle="info" fill name={key} onClick={this.handleTaskEdit}>Edit</Button>
                                            <Button bsStyle="danger" fill name={item.id} onClick={this.handleTaskDelete}>Delete</Button>
                                        </td>
                                    </tr>
                                );
                            })
                        ):null
                    }
                </tbody>
            </Table>
        );

        const tabs = (
            <Tab.Container id="tabs-with-dropdown" defaultActiveKey="info">
                <Row className="clearfix">
                    <Col sm={12}>
                        <Nav bsStyle="tabs">
                            <NavItem eventKey="info">Flows</NavItem>
                            <NavItem eventKey="account">Users</NavItem>
                            <NavItem eventKey="style">Tasks</NavItem>
                            <NavItem eventKey="settings">Reviews</NavItem>
                        </Nav>
                    </Col>
                    <Col sm={12}>
                        <Tab.Content animation>
                            <Tab.Pane eventKey="info">
                                {Flowtable}
                            </Tab.Pane>
                            <Tab.Pane eventKey="account">
                                {UserTable}
                            </Tab.Pane>
                            <Tab.Pane eventKey="style">
                                {TasksTablse}
                            </Tab.Pane>
                            <Tab.Pane eventKey="settings">
                                <div className="search-bar">
                                    <Row>
                                        <Col md={4}>
                                            <ControlLabel>Searching Constraints</ControlLabel>
                                        </Col>
                                        <Col md={4}>
                                            <select className="form-control" onChange={this.handleUserChange}>
                                                <option value="">--------------</option>
                                                {
                                                    this.state.user.datas.map((item, key) => {
                                                        return (
                                                            <option value={item.id} key={key}>{item.name}</option>
                                                        )
                                                    })
                                                }
                                            </select>
                                        </Col>
                                        <Col md={4}>
                                            <Datetime
                                                timeFormat={false}
                                                inputProps={{placeholder:"Datetime Picker Here"}}
                                                defaultValue={new Date()}
                                                onChange={this.handleDateChange}
                                            />
                                        </Col>
                                    </Row>
                                </div>
                                <Masonry
                                    className // default ''
                                    options={masonryOptions} // default {}
                                    disableImagesLoaded={false} // default false
                                    updateOnEachImageLoad={false} // default false and works only if disableImagesLoaded is false
                                >
                                    {ReviewCard}
                                </Masonry>
                            </Tab.Pane>
                        </Tab.Content>
                    </Col>
                </Row>
            </Tab.Container>
        );

        return (
            <div className="main-content">
                {this.state.flow.alert}
                {this.state.user.alert}
                {this.state.task.alert}
                <Grid fluid>
                    <Row>
                        <Col md={12}>
                            <Card
                                title="Manage Data"
                                content={tabs}
                            />
                        </Col>
                    </Row>
                </Grid>
                <Modal show={this.state.flow.showModal} onHide={this.handleFlowHide}>
                    <Modal.Header closeButton>
                        <Modal.Title>Flow</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        <FormGroup>
                            <ControlLabel>
                                Flow
                            </ControlLabel>
                            <FormControl
                                placeholder="text...."
                                type="text"
                                value={this.state.flow.data}
                                onChange={this.handleFlowChange}
                            />
                            <span className="help-block">{this.state.flow.error}</span>
                        </FormGroup>
                    </Modal.Body>
                    <Modal.Footer>
                        <Button bsStyle="default" onClick={this.handleFlowHide}>Close</Button>
                        {this.state.flow.update?<Button bsStyle="primary" onClick={this.updateFlow}>Update</Button>:<Button bsStyle="primary" onClick={this.handleFlowSubmit}>Submit</Button>}
                    </Modal.Footer>
                </Modal>
                <Modal show={this.state.user.showModal} onHide={this.handleUserHide}>
                    <Modal.Header closeButton>
                        <Modal.Title>User</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        <FormGroup>
                            <ControlLabel>
                                Username
                            </ControlLabel>
                            <FormControl
                                placeholder="username...."
                                type="text"
                                value={this.state.user.name}
                                onChange={this.handleUsername}
                            />
                            <span className="help-block">{this.state.user.nameerror}</span>
                        </FormGroup>
                        <FormGroup>
                            <ControlLabel>
                                Email
                            </ControlLabel>
                            <FormControl
                                placeholder="email...."
                                type="email"
                                disabled={this.state.user.update}
                                value={this.state.user.email}
                                onChange={this.handleUserEmail}
                            />
                            <span className="help-block">{this.state.user.emailerror}</span>
                        </FormGroup>
                        <FormGroup>
                            <ControlLabel>
                                Role
                            </ControlLabel>
                            <Radio
                                number="1"
                                option="1"
                                name="role"
                                onChange={this.handleRadio}
                                checked={this.state.user.role === "1"}
                                label="Admin"
                            />
                            <Radio
                                number="2"
                                option="2"
                                name="role"
                                onChange={this.handleRadio}
                                checked={this.state.user.role === "2"}
                                label="Manager"
                            />
                            <Radio
                                number="3"
                                option="3"
                                name="role"
                                onChange={this.handleRadio}
                                checked={this.state.user.role === "3"}
                                label="User"
                            />
                        </FormGroup>
                    </Modal.Body>
                    <Modal.Footer>
                        <Button bsStyle="default" onClick={this.handleUserHide}>Close</Button>
                        {this.state.user.update?<Button bsStyle="primary" onClick={this.handleUserUpdate}>Update</Button>:<Button bsStyle="primary" onClick={this.handleUserSubmit}>Submit</Button>}
                    </Modal.Footer>
                </Modal>
                <Modal show={this.state.task.showModal} onHide={this.handleTaskHide}>
                    <Modal.Header closeButton>
                        <Modal.Title>Task</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        <FormGroup>
                            <ControlLabel>
                                Task
                            </ControlLabel>
                            <FormControl
                                placeholder="text...."
                                type="text"
                                value={this.state.task.name}
                                onChange={this.handleTaskChange}
                            />
                            <span className="help-block">{this.state.task.nameError}</span>
                        </FormGroup>
                        <FormGroup>
                            <ControlLabel>Flow</ControlLabel>
                            <select className="form-control" value={this.state.task.flow} onChange={this.handleFlowSelection}>
                                <option value="">--------------</option>
                                {
                                    this.state.flow.datas.map((item, key) => {
                                        return (
                                            <option value={item.id} key={key}>{item.name}</option>
                                        )
                                    })
                                }
                            </select>
                            <span className="help-block">{this.state.task.flowError}</span>
                        </FormGroup>
                    </Modal.Body>
                    <Modal.Footer>
                        <Button bsStyle="default" onClick={this.handleTaskHide}>Close</Button>
                        {this.state.task.update?<Button bsStyle="primary" onClick={this.updateTask}>Update</Button>:<Button bsStyle="primary" onClick={this.handleTaskSubmit}>Submit</Button>}
                    </Modal.Footer>
                </Modal>
            </div>
        )
    }
}

export default Department;