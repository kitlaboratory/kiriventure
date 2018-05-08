import React, { Component } from 'react';
import {
    Grid, Row, Col,
    Table, Modal, FormGroup, ControlLabel, FormControl
} from 'react-bootstrap';
// react component that creates a switch button that changes from on to off mode
import Switch from 'react-bootstrap-switch';
import Button from '../../elements/CustomButton/CustomButton.jsx';
import SweetAlert from 'react-bootstrap-sweetalert';
import Card from '../../components/Card/Card.jsx';
import {createCredo, getCredos, updateIsActive, updateCredo, deleteCredo} from '../../firebase/database';

const INITIALSTATE = {
    credo: "",
    credoID: "",
    error: "",
    credos: [],
    showModal: false,
    alert: null,
    update: false
}

class Credo extends Component {

    constructor(props) {
        super(props);
        this.state = {...INITIALSTATE}
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
                    You will not be able to recover this credo!
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
                    showConfirm={false}
                >
                    Your credo has been deleted.
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
                    showConfirm={false}
                >
                    Your credo did not delete :)
                </SweetAlert>
            )
        })
    }

    hideAlert = () => {
        this.setState({
            alert: null
        });
    }

    handleDelete = (id) => {
        deleteCredo(id).then(response => {
            if(response){
                this.successAlert();
                this.fetchCredos();
            }
        }).catch(error => {
            this.errorAlert();
        });
        setTimeout(this.hideAlert, 2000);
    }

    handleSwitch = (elem, status) => {
        let id = elem.props.name;
        updateIsActive(id, status);
    }

    handleShow = () => {
        this.setState({showModal: true})
    }

    handleHide = () => {
        this.setState({
            credo: "",
            credoID: "",
            error: "",
            showModal: false,
            alert: null,
            update: false
        });
    }

    handleUpdate = (e) => {
        const text = e.target.name;
        let credo = text.substring(0, text.indexOf(":"));
        let id = text.substring(text.indexOf(":")+1);
        this.setState({
            credo: credo,
            credoID: id,
            update: true
        },()=> this.handleShow());
    }

    updateCredo = () => {
        const {credoID , credo} = this.state;
        if(credo !== ""){
            updateCredo(credoID, credo).then(response => {
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
                                Your credo has been updated.
                            </SweetAlert>
                        ),
                        credo: "",
                        error: ""
                    }, () => this.fetchCredos());
                    setTimeout(this.hideAlert, 2000);
                }
            }).catch(error => console.log(error));
        }else{
            return;
        }
    }

    handleChange = (e) => {
        let text = e.target.value;
        if(text === ""){
            this.setState({
                error: "Credo is required!",
                credo: text
            })
        }else{
            this.setState({
                error: "",
                credo: text
            })
        }
    }

    handleSubmit = () => {
        const {credo} = this.state;
        if(credo !== ""){
            createCredo(credo)
            .then(response => {
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
                            Your credo has been added.
                        </SweetAlert>
                    ),
                    credo: "",
                    credoID: ""
                })
                setTimeout(this.hideAlert, 2000);
            }).catch(error => {
                this.setState({
                    alert: (
                        <SweetAlert
                            danger
                            style={{display: "block",marginTop: "-100px"}}
                            title="Added!"
                            onConfirm={() => this.hideAlert()}
                            onCancel={() => this.hideAlert()}
                            confirmBtnBsStyle="info"
                        >
                            Your credo did not add.
                        </SweetAlert>
                    )
                })
            })
        }else{
            this.setState({error: "Credo is required!"})
            return;
        }
    }

    fetchCredos = () =>{
        getCredos().then(response => {
            this.setState({
                credos: response
            })
        }).catch(error => console.log(error));
    }

    componentDidMount() {
        this.fetchCredos();
    }

    render() {
        return(
            <div className="main-content">
                {this.state.alert}
                <Grid fluid>
                    <Row>
                    <Col md={12}>
                            <Card
                                title="Credo Management"
                                category=""
                                rightBtn={<Button bsStyle="primary" fill pullRight onClick={this.handleShow}>Add</Button>}
                                tableFullWidth
                                content={
                                    <Table striped responsive>
                                        <thead>
                                            <tr>
                                                <th className="text-center">#</th>
                                                <th>Name</th>
                                                <th>Active</th>
                                                <th className="text-center">Actions</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {
                                                this.state.credos.map((item, key) => {
                                                    return(
                                                        <tr key={key}>
                                                            <td className="text-center">{key + 1}</td>
                                                            <td>{item.name}</td>
                                                            <td>
                                                                <Switch
                                                                    onText=""
                                                                    offText=""
                                                                    name={item.id}
                                                                    defaultValue={item.isActive}
                                                                    onChange={(el, state) => this.handleSwitch(el, state)}
                                                                />
                                                            </td>
                                                            <td className="text-center">
                                                                <Button bsStyle="info" fill name={item.name+":"+item.id} onClick={this.handleUpdate}>Edit</Button>
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
                        <Modal.Title>Credo</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        <FormGroup>
                            <ControlLabel>
                                Credo
                            </ControlLabel>
                            <FormControl
                                placeholder="text...."
                                type="text"
                                value={this.state.credo}
                                onChange={this.handleChange}
                            />
                            <span className="help-block">{this.state.error}</span>
                        </FormGroup>
                    </Modal.Body>
                    <Modal.Footer>
                        <Button bsStyle="default" onClick={this.handleHide}>Close</Button>
                        {this.state.update?<Button bsStyle="primary" onClick={this.updateCredo}>Update</Button>:<Button bsStyle="primary" onClick={this.handleSubmit}>Submit</Button>}
                    </Modal.Footer>
                </Modal>
            </div>
        )
    }
}

export default Credo;