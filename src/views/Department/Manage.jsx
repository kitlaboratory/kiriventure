import React, { Component } from 'react';
import {
    Grid, Row, Col,
    Table, Modal, FormGroup, ControlLabel, FormControl
} from 'react-bootstrap';
// react component that creates a switch button that changes from on to off mode
import Button from '../../elements/CustomButton/CustomButton.jsx';
import SweetAlert from 'react-bootstrap-sweetalert';
import Card from '../../components/Card/Card.jsx';
import {createDepartment, getDepartments, deleteDepartment, updateDepartment} from '../../firebase/database'

const INITIALSTATE = {
    showModal: false,
    department: "",
    departments: [],
    error: "",
    alert: null,
    show: false,
    update: false,
    depID: ""
}

class ManageDep extends Component {

    constructor(props) {
        super(props);
        this.state = { ...INITIALSTATE };
    }

    confirmAlert = (e) => {
        const id = e.target.name;
        this.setState({
            alert: (
                <SweetAlert
                    warning
                    style={{display: "block",marginTop: "-100px"}}
                    title="Are you sure?"
                    onConfirm={() => this.handleDelete(id)}
                    onCancel={() => this.hideAlert()}
                    confirmBtnBsStyle="info"
                    cancelBtnBsStyle="danger"
                    confirmBtnText="Yes, delete it!"
                    cancelBtnText="Cancel"
                    showCancel
                >
                    You will not be able to recover this department!
                </SweetAlert>
            )
        });
    }

    successAlert = () => {
        this.setState({
            alert: (
                <SweetAlert
                    success
                    style={{display: "block",marginTop: "-100px"}}
                    title="Deleted!"
                    onConfirm={() => this.hideAlert()}
                    onCancel={() => this.hideAlert()}
                    confirmBtnBsStyle="info"
                >
                    Your department has been deleted.
                </SweetAlert>
            )
        });
    }

    errorAlert = () => {
        this.setState({
            alert: (
                <SweetAlert
                    danger
                    style={{display: "block",marginTop: "-100px"}}
                    title="Cancelled"
                    onConfirm={() => this.hideAlert()}
                    onCancel={() => this.hideAlert()}
                    confirmBtnBsStyle="info"
                >
                    Your department did not delete :)
                </SweetAlert>
            )
        })
    }

    hideAlert = () => {
        this.setState({
            alert: null
        });
    }

    handleHide = () => {
        this.setState({
            alert: null,
            department: '',
            error: "",
            show: false,
            showModal: false,
            update: false,
            depID:""
        });
    }

    handleShow = () => {
        this.setState({showModal: true});
    }

    handleUpdate = (e) => {
        e.preventDefault();
        console.log(e.target);
        const text = e.target.name;
        let name = text.substring(0, text.indexOf(":"));
        let id = text.substring(text.indexOf(":")+1);
        console.log(name, id);
        this.setState({
            department: name,
            depID: id,
            update: true
        }, () => {
            this.handleShow();
        })
    }

    updateDep = () => {
        const {department, depID} = this.state;
        if(department !== ""){
            updateDepartment(depID, department).then(response => {
                if(response){
                    this.setState({
                        alert: (
                            <SweetAlert
                                success
                                style={{display: "block",marginTop: "-100px"}}
                                title="Updated!"
                                onConfirm={() => this.hideAlert()}
                                onCancel={() => this.hideAlert()}
                                showConfirm={false}
                            >
                                Your department has been updated.
                            </SweetAlert>
                        ),
                        showModal: false,
                        department: "",
                        error: "",
                        update: false
                    }, () => this.fetchDepartments());
                    setTimeout(this.hideAlert, 1500);
                }
            }).catch(error => {
                this.setState({
                    alert: (
                        <SweetAlert
                            danger
                            style={{display: "block",marginTop: "-100px"}}
                            title="Failed!"
                            onConfirm={() => this.hideAlert()}
                            onCancel={() => this.hideAlert()}
                            confirmBtnBsStyle="info"
                        >
                            Your department did not update :)
                        </SweetAlert>
                    )
                });
            })
        }else{
            return;
        }
    }

    handleChange = (e) => {
        let text= e.target.value;
        if(text === ""){
            this.setState({
                error: 'Name is required',
                department: text,
            })
        }else{
            this.setState({
                error: '',
                department: text,
            })
        }
    }

    handleSubmit = () => {
        const {department} = this.state;
        if(department !== "") {
            createDepartment(department).then(response => {
                this.setState({
                    alert: (
                        <SweetAlert
                            success
                            style={{display: "block",marginTop: "-100px"}}
                            title="Added!"
                            onConfirm={() => this.hideAlert()}
                            onCancel={() => this.hideAlert()}
                            showConfirm={false}
                        >
                            Your department has been added!
                        </SweetAlert>
                    ),
                    department: ""
                });
                setTimeout(this.hideAlert,1500);
            }).catch(error => {
                this.setState({
                    alert: (
                        <SweetAlert
                            danger
                            style={{display: "block",marginTop: "-100px"}}
                            title="Failed!"
                            onConfirm={() => this.hideAlert()}
                            onCancel={() => this.hideAlert()}
                            showConfirm={false}
                        >
                            Your department did not add :)
                        </SweetAlert>
                    ),
                });
                setTimeout(this.hideAlert,1500);
            });
        }else{
            this.setState({error: "Name is required!"})
            return;
        }
    }

    handleView = (e) => {
        const keyText = e.target.name;
        const {history} = this.props;
        history.push('/departments/'+keyText);
    }

    handleDelete = (id) => {
        deleteDepartment(id).then(response => {
            if(response) {
                this.successAlert();
                this.fetchDepartments();
            }
        }).catch(error => {
            this.errorAlert();
        });
        setTimeout(this.hideAlert, 1500);
    }

    fetchDepartments = () => {
        getDepartments().then(response => {
            this.setState({
                departments: response
            });
        }).catch(error => {
            console.log(error);
        });
    }

    componentDidMount() {
        this.fetchDepartments();
    }

    render() {
        return(
            <div className="main-content">
                {this.state.alert}
                <Grid fluid>
                    <Row>
                    <Col md={12}>
                            <Card
                                title="Department Management"
                                rightBtn={(<Button bsStyle="primary" fill pullRight onClick={this.handleShow}>Add</Button>)}
                                tableFullWidth
                                content={
                                    <Table striped responsive>
                                        <thead>
                                            <tr>
                                                <th className="text-center">#</th>
                                                <th>Name</th>
                                                <th className="text-center">Action</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {
                                                this.state.departments.map((item, key) => {
                                                    return(
                                                        <tr key={key}>
                                                            <td className="text-center">{key + 1}</td>
                                                            <td>{item.name}</td>
                                                            <td className="text-center">
                                                                <Button bsStyle="info" fill name={item.id} onClick={this.handleView}>View</Button>
                                                                <Button bsStyle="primary" fill name={item.name+":"+item.id} onClick={this.handleUpdate}>Edit</Button>
                                                                <Button bsStyle="danger" fill name={item.id} onClick={this.confirmAlert}>Delete</Button>
                                                            </td>
                                                        </tr>
                                                    );
                                                })
                                            }
                                        </tbody>
                                    </Table>
                                }
                            />
                        </Col>
                    </Row>
                </Grid>
                <Modal show={this.state.showModal} onHide={this.handleHide}>
                    <Modal.Header closeButton>
                        <Modal.Title>Department</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        <FormGroup>
                            <ControlLabel>
                                Department
                            </ControlLabel>
                            <FormControl
                                placeholder="Enter department"
                                type="email"
                                value={this.state.department}
                                onChange={this.handleChange}
                            />
                            <span className="help-block">{this.state.error}</span>
                        </FormGroup>
                    </Modal.Body>
                    <Modal.Footer>
                        <Button bsStyle="default" onClick={this.handleHide}>Close</Button>
                        {this.state.update?<Button bsStyle="primary" onClick={this.updateDep}>update</Button>:<Button bsStyle="primary" onClick={this.handleSubmit}>Submit</Button>}
                    </Modal.Footer>
                </Modal>
            </div>
        )
    }
}

export default ManageDep;