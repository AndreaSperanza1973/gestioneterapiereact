import React, { Component } from 'react';
import { Container, Row, Col, Form, Button, Modal, Spinner, Tabs, Tab, Table } from 'react-bootstrap';
import { RowCustom } from "../Doctor/PatientComponent";
import { Eye } from 'react-bootstrap-icons';
import { user, medico, patient, patientcode } from '../helpers/api/api';
import { NotificationContainer, NotificationManager } from 'react-notifications';
import { NotificationContainer as ContainerModal, NotificationManager as ManagerModal } from 'react-notifications';
import { entitiesLabels, message , role } from '../helpers/Constants';
import SimpleReactValidator from 'simple-react-validator';
export class DoctorProfile extends Component {
    userModelProp = () => ({
        idDoctor: 0,
        fiscalCode: '',
        name: '',
        surName: '',
        email: '',
        phoneNumber: '',
        idCentroMedico: 0,

    });
    passwordModelProp = () => ({
        resetPasswordCode: '',
        confirmPassword: '',
        newPassword: '',
        username: '',

    });
    constructor(props) {
        super(props);

        this.validator = new SimpleReactValidator();
        this.state = {
            isOpenChangePassword: false,
            email: '',
            isSending: false,
            listCentriMedici: [],
            listPatient: [],
            listPatientCode: [],
            currentPage: 1,
            itemPerPage: 5,
            userDto: {
                ...this.userModelProp(),
            },

            passwordModel: {
                ...this.passwordModelProp(),
            }
        }
        this.getProfile = this.getProfile.bind(this);
        this.getListPatient = this.getListPatient.bind(this);
        this.getListMedicalCenter = this.getListMedicalCenter.bind(this);
    }
    componentDidMount() {
        this.getProfile();
        this.getListPatient();
        this.getListMedicalCenter();
    }

    //FUNZIONI
    getListPatient = () => {



    }
    getListMedicalCenter = () => {
        medico.getAll("GetCentriMedici")
            .then(async (response) => {
                if (response.status == 200) {
                    this.setState({ listCentriMedici: response.data.dati });

                }
            }).catch((error) => {

            })
            .finally(() => {
            });

    }
    getProfile = () => {
        let id = window.location.pathname.split('/').pop();
        id = parseInt(id);
        if (!id) {
            let dto = localStorage.getItem("role");
            dto = JSON.parse(dto);
            id = dto.idRole == 1 ? dto.id : 0;
        }
        medico.get("Get/", parseInt(id))
            .then((response) => {
                if (response.status == 200) {
                    this.setState({ userDto: response.data.dati });

                    const statusCopy = { ...this.state };
                    statusCopy['userDto']['idDoctor'] = response.data.dati.id;
                    if (JSON.parse(localStorage.getItem("role")).idRole == role.CAREMANAGER) {

                        patient.get("GetByDoctor/", response.data.dati.id)
                            .then((response) => {
                                if (response.status === 200) {
                                    this.setState({ listPatient: response.data.dati });
                                }
                            }).catch((error) => {

                            });
                            patientcode.getAll("GetCodiciPazienti")
                            .then((response) => {
                                if (response.status === 200) {
                                    this.setState({ listPatientCode: response.data.dati });
                                }
                            }).catch((error) => {

                            });
                    }
                }
            }).catch((error) => {
                if (error) {
                    const statusCopy = { ...this.state };
                    statusCopy['userDto']['idDoctor'] = error;
                }
            })

    }
    onChange = (inputName) => {
        const selected = inputName.target;
        const id = selected.children[selected.selectedIndex].id;
        const statusCopy = { ...this.state };
        statusCopy['userDto']['idCentroMedico'] = parseInt(id);
        this.setState(statusCopy);
    };
    handleCloseChangePassword = () => {
        this.setState({ isOpenChangePassword: false });
    }
    handleShowChangePassword = () => {
        this.setState({ isOpenChangePassword: true });
    }
    sedRestCode = () => {
        this.setState((prevState) => ({ isSending: true }))
        user.post("RequestNewPassword", this.state.userDto.email)
            .then((response) => {
                if (response.status === 200) {
                    ManagerModal.success(message.CODICE + message.SuccessSend, entitiesLabels.SUCCESS, 3000);
                    this.setState({ isSending: false });
                } else {
                    ManagerModal.error(message.CODICE + message.ErroSend, entitiesLabels.ERROR, 3000);
                    this.setState({ isSending: false });
                }
            }).catch((error) => {
                ManagerModal.error(message.CODICE + message.ErroSend, entitiesLabels.ERROR, 3000);
                this.setState({ isSending: false });
            });
    }
    sendChangeProfile = () => {
        this.setState((prevState) => ({ isSending: true }))
        medico.post("Edit", this.state.userDto)
            .then((response) => {
                if (response.status === 200) {
                    ManagerModal.success(message.CODICE + message.SuccessSend, entitiesLabels.SUCCESS, 3000);
                    this.setState({ isSending: false });
                } else {
                    ManagerModal.error(message.CODICE + message.ErroSend, entitiesLabels.ERROR, 3000);
                    this.setState({ isSending: false });
                }
            }).catch((error) => {
                ManagerModal.error(message.CODICE + message.ErroSend, entitiesLabels.ERROR, 3000);
                this.setState({ isSending: false });
            });
    }
    sendChangePassword = () => {
        this.setState((prevState) => ({ isSending: true }))
        const statusCopy = { ...this.state };
        statusCopy['passwordModel']['username'] = this.state.userDto.email;

        this.setState(statusCopy);
        user.post("ChangePassword", this.state.passwordModel)
            .then((response) => {
                if (response.status === 200) {
                    ManagerModal.success(message.CODICE + message.SuccessSend, entitiesLabels.SUCCESS, 3000);
                    this.setState({ isSending: false });
                } else {
                    ManagerModal.error(message.CODICE + message.ErroSend, entitiesLabels.ERROR, 3000);
                    this.setState({ isSending: false });
                }
            }).catch((error) => {
                ManagerModal.error(message.CODICE + message.ErroSend, entitiesLabels.ERROR, 3000);
                this.setState({ isSending: false });
            });
    }
    handleChange = (el) => {
        let objName = el.target.alt;
        const inputName = el.target.name;
        const inputValue = el.target.value;
        this.updateState(inputName, inputValue, objName);
    };

    updateState = (inputName, inputValue, objName) => {
        const statusCopy = { ...this.state };
        statusCopy[objName][inputName] = inputValue;

        this.setState(statusCopy);
    };
    showPassword = () => {
        var x = document.getElementById("newPassword");
        if (x.type === "password") {
            x.type = "text";
        } else {
            x.type = "password";
        }
    }

    showConfirmPassword = () => {
        var x = document.getElementById("confirmnewPassword");
        if (x.type === "password") {
            x.type = "text";
        } else {
            x.type = "password";
        }
    }

    render() {
        const validations = {
            email: this.validator.message(
                'Email',
                this.state.userDto.email,
                'required'
            ),
            telephone: this.validator.message(
                'Telefone',
                this.state.userDto.telephone,
                'required'
            ),
            password: this.validator.message(
                'Password',
                this.state.userDto.password,
                'required'
            ),
            confirmpassword: this.validator.message(
                'Confirm Password',
                this.state.userDto.confirmpassword,
                'required'
            ),
        };
        const indexOfLastPatient = this.state.currentPage * this.state.itemPerPage;
        const indexOfFirstPatient = indexOfLastPatient - this.state.itemPerPage;
        const currentItem =this.state.listPatient ? this.state.listPatient.slice(indexOfFirstPatient, indexOfLastPatient) : [];
        const currentItemsCode =this.state.listPatientCode ? this.state.listPatientCode.slice(indexOfFirstPatient, indexOfLastPatient) :[];
        return (<>
            {JSON.parse(localStorage.getItem("role")).idRole == role.CAREMANAGER ?
                //CAREMANAGER
                <>
                    <Container className='col-12 pt-4 row'>
                        <Tabs defaultActiveKey="profile" id="uncontrolled-tab-example" className=" col-12 mb-3">
                            <Tab eventKey="profile" title="Anagrafica Medico">
                                <Form className='col-12 pt-4 row'>
                                    <Row className="col-12 mb-3" >
                                        <Form.Group className="col-6 mb-3" controlId="formBasicEmail">
                                            <Form.Label className="">Cognome</Form.Label>
                                            <Form.Control id='surName' alt='userDto' name="surName" onChange={this.handleChange} value={this.state.userDto.surName ? this.state.userDto.surName : ''} placeholder="Enter cognome" />
                                        </Form.Group>
                                        <Form.Group className="col-6 mb-3" controlId="formBasicEmail">
                                            <Form.Label className="">Nome</Form.Label>
                                            <Form.Control id='name' alt='userDto' name="name" onChange={this.handleChange} value={this.state.userDto.name ? this.state.userDto.name : ''} placeholder="Enter Nome" />
                                        </Form.Group>
                                    </Row>
                                    <Row>
                                        <Form.Group className="col-6 mb-3" controlId="formBasicEmail">
                                            <Form.Label className="">Codice Fiscale</Form.Label>
                                            <Form.Control id='fiscalCode' alt='userDto' name="fiscalCode" onChange={this.handleChange} value={this.state.userDto.fiscalCode ? this.state.userDto.fiscalCode : ''} placeholder="Enter Codice fiscale" />
                                        </Form.Group>
                                        <Form.Group className="col-4 mb-3 input-layout-wrapper" >
                                            <Form.Label className="text-light">Centro Medico</Form.Label>
                                            <Form.Select id='mendicalCenter' onChange={this.onChange} name="mendicalCenter" alt="medicoDTO" placeholder="Enter centro medico" >
                                                {this.state.listCentriMedici.map((item) =>

                                                    <option id={item.id} selected={this.state.userDto.idCentroMedico == item.id ? "selected" : ''}>{item.nomeCentro}</option>
                                                )}
                                            </Form.Select>
                                        </Form.Group>
                                    </Row>

                                    <Row>
                                        <Form.Group className="col-6 mb-3" controlId="formBasicEmail">
                                            <Form.Label className="">Email</Form.Label>
                                            <Form.Control disabled id='email' name="email" onChange={this.handleChange} value={this.state.userDto.email} isInvalid={validations.email != null} placeholder="Enter email" />
                                        </Form.Group>
                                        <Form.Group className="col-6 mb-3" controlId="formBasicEmail">
                                            <Form.Label className="">Telefono</Form.Label>
                                            <Form.Control id='phoneNumber' alt='userDto' name="phoneNumber" onChange={this.handleChange} isInvalid={validations.telephone != null} value={this.state.userDto.phoneNumber} placeholder="Enter telefono" />
                                        </Form.Group>
                                    </Row>
                                    <Row>
                                        <Form.Group className="col-4 mb-3" controlId="formBasicPassword">
                                            <Button variant="btn btn-primary " onClick={() => this.handleShowChangePassword()}>
                                                Modifica Password
                                            </Button>
                                        </Form.Group>
                                        <Form.Group className="col-4 mb-3" controlId="formBasicPassword">
                                            <Button variant="btn btn-primary " onClick={() => this.sendChangeProfile()}>
                                                Modifica Profilo
                                            </Button>
                                        </Form.Group>
                                        <Form.Group className="col-4 mb-3" controlId="formBasicPassword">
                                            {JSON.parse(localStorage.getItem("role")).idRole == 4 ?
                                                <Form.Check
                                                    type="switch"
                                                    id="custom-switch"
                                                    label="Disattiva"
                                                /> : ''
                                            }
                                        </Form.Group>
                                    </Row>

                                </Form>
                                <Modal
                                    show={this.state.isOpenChangePassword}
                                    onHide={() => this.handleCloseChangePassword()}
                                    backdrop="static"
                                    keyboard={false}
                                >
                                    <Modal.Header closeButton>
                                        <Modal.Title>Modifica Password</Modal.Title>
                                    </Modal.Header>
                                    <Modal.Body>
                                        <Row>
                                            <Form.Group className="col-12 mb-3" controlId="formBasicEmail">
                                                <Form.Label className="text">Username</Form.Label>
                                                <Form.Control value={this.state.userDto.email} disabled name="farmaco" placeholder="Inserisci farmaco" />
                                            </Form.Group>
                                        </Row>
                                        <Row>
                                            <Form.Group className="col-6 mb-3" controlId="formBasicEmail">
                                                <Form.Label className="text">Nuova Password</Form.Label><Eye size='22' onClick={() => this.showPassword()} className='icon-black' />
                                                <Form.Control id="newPassword" alt="passwordModel" onChange={this.handleChange} name="newPassword" type='password' placeholder="Inserisci Dosagio" />
                                            </Form.Group>
                                            <Form.Group className="col-6 mb-3" controlId="formBasicEmail">
                                                <Form.Label className="text" >Conferma Password</Form.Label><Eye size='22' onClick={() => this.showConfirmPassword()} className='icon-black' />
                                                <Form.Control id="confirmPassword" alt="passwordModel" onChange={this.handleChange} name="confirmPassword" type='password' placeholder="Inserisci quantita" />
                                            </Form.Group>

                                            {validations.equalPass ? (
                                                <div className=" input-layout-wrapper text-danger">
                                                    {' '}
                                                    Le password devono coincidere{' '}
                                                </div>
                                            ) : <div className=" input-layout-wrapper text-danger is-12">
                                                {' '}{' '}
                                            </div>}
                                        </Row>
                                        <Row>
                                            <Form.Group className="col-12 mb-3" controlId="formBasicEmail">
                                                <Form.Label className="text">Codice Reset</Form.Label>
                                                <Form.Control id="resetPasswordCode" name="resetPasswordCode" alt="passwordModel" onChange={this.handleChange} placeholder="Inserisci farmaco" />
                                            </Form.Group>
                                        </Row>
                                    </Modal.Body>
                                    <Modal.Footer>
                                        <Button variant="secondary" onClick={() => this.handleCloseChangePassword()}>
                                            Chiudi
                                        </Button>
                                        <Button variant="secondary" onClick={() => this.sedRestCode()} > {this.state.isSending == true ? <Spinner
                                            as="span"
                                            animation="border"
                                            size="sm"
                                            role="status"
                                            aria-hidden="true"
                                        /> : ''}Richiedi codice</Button>
                                        <Button variant="primary" onClick={() => this.sendChangePassword()}>{this.state.isSending == true ? <Spinner
                                            as="span"
                                            animation="border"
                                            size="sm"
                                            role="status"
                                            aria-hidden="true"
                                        /> : ''}Cambia Password</Button>
                                    </Modal.Footer>
                                    <ContainerModal />
                                </Modal>
                            </Tab>
                            <Tab eventKey="listPatient" title="Elenco Pazienti">
                                <Table striped bordered hover size="sm">
                                    <thead>
                                        <tr>
                                        <th>Codice Paziente</th>
                                            <th>Codice Paziente</th>
                                            <th>Codice Fiscale</th>
                                            <th>Cognome</th>
                                            <th>Nome</th>
                                            <th>Email</th>
                                            <th>Telefono</th>
                                            <th>Stato Paziente</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {
                                          this.state.listPatient ?  currentItem.map((pa) => <RowCustom colums={["id","codicePaziente", "fiscalCode", "surName", "name", "email", "phoneNumber", "isActive"]} link={'id'} reference={'id'} controller={'PatientRegistry'} item={pa} />) : ''
                                        }
                                    </tbody>
                                </Table>
                            </Tab>
                            <Tab eventKey="listcode" title="Codici Paziente">
                                <Row className='col-12 pt-4' >
                                    <div className='col-12'>
                                        <h2>Elenco codici pazienti assegnati</h2>
                                    </div>
                                </Row>
                                <Table striped bordered hover size="sm">
                                    <thead>
                                        <tr>
                                            <th>Data Richiesta</th>
                                            <th>Data Emissione</th>
                                            <th>Codice Inizio</th>
                                            <th>Codice Fine</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {
                                         this.state.listPatientCode ?    currentItemsCode.map((pa) => <RowCustom colums={["dataStart", "dataEnd", "codiStart", "codiEnd"]} item={pa} />) : ''
                                        }
                                    </tbody>
                                </Table>
                            </Tab>
                        </Tabs>

                    </Container>
                </>
                :
                //MEDICO
                <>
                    <Container className='col-12 pt-4 row'>
                        <Form className='col-12 pt-4 row'>
                            
                                <Form.Group className="col-6 mb-3" controlId="formBasicEmail">
                                    <Form.Label className="">Cognome</Form.Label>
                                    <Form.Control id='surName' alt='userDto' name="surName" onChange={this.handleChange} value={this.state.userDto.surName} placeholder="Enter cognome" />
                                </Form.Group>
                                <Form.Group className="col-6 mb-3" controlId="formBasicEmail">
                                    <Form.Label className="">Nome</Form.Label>
                                    <Form.Control id='name' alt='userDto' name="name" onChange={this.handleChange} value={this.state.userDto.name} placeholder="Enter Nome" />
                                </Form.Group>
                           
                                <Form.Group className="col-6 mb-3" controlId="formBasicEmail">
                                    <Form.Label className="">Codice Fiscale</Form.Label>
                                    <Form.Control id='fiscalCode' alt='userDto' name="fiscalCode" onChange={this.handleChange} value={this.state.userDto.fiscalCode} placeholder="Enter Codice fiscale" />
                                </Form.Group>
                                <Form.Group className="col-4 mb-3 input-layout-wrapper" >
                                    <Form.Label className="">Centro Medico</Form.Label>
                                    <Form.Select id='mendicalCenter' onChange={this.onChange} name="mendicalCenter" alt="medicoDTO" placeholder="Enter centro medico" >
                                        {this.state.listCentriMedici.map((item) =>

                                            <option id={item.id} selected={this.state.userDto.idCentroMedico == item.id ? "selected" : ''}>{item.nomeCentro}</option>
                                        )}
                                    </Form.Select>
                                </Form.Group>
                           
                                <Form.Group className="col-6 mb-3" controlId="formBasicEmail">
                                    <Form.Label className="">Email</Form.Label>
                                    <Form.Control disabled id='email' name="email" onChange={this.handleChange} value={this.state.userDto.email} isInvalid={validations.email != null} placeholder="Enter email" />
                                </Form.Group>
                                <Form.Group className="col-6 mb-3" controlId="formBasicEmail">
                                    <Form.Label className="">Telefono</Form.Label>
                                    <Form.Control id='phoneNumber' alt='userDto' name="phoneNumber" onChange={this.handleChange} isInvalid={validations.telephone != null} value={this.state.userDto.phoneNumber} placeholder="Enter telefono" />
                                </Form.Group>
                           
                                <Form.Group className="col-4 mb-3" controlId="formBasicPassword">
                                    <Button variant="btn btn-primary " onClick={() => this.handleShowChangePassword()}>
                                        Modifica Password
                                    </Button>
                                </Form.Group>
                                <Form.Group className="col-4 mb-3" controlId="formBasicPassword">
                                    <Button variant="btn btn-primary " onClick={() => this.sendChangeProfile()}>
                                        Modifica Profilo
                                    </Button>
                                </Form.Group>
                                <Form.Group className="col-4 mb-3" controlId="formBasicPassword">
                                    {JSON.parse(localStorage.getItem("role")).idRole == 4 ?
                                        <Form.Check
                                            type="switch"
                                            id="custom-switch"
                                            label="Disattiva"
                                        /> : ''
                                    }
                                </Form.Group>
                            

                        </Form>
                        <Modal
                            show={this.state.isOpenChangePassword}
                            onHide={() => this.handleCloseChangePassword()}
                            backdrop="static"
                            keyboard={false}
                        >
                            <Modal.Header closeButton>
                                <Modal.Title>Modifica Password</Modal.Title>
                            </Modal.Header>
                            <Modal.Body>
                                <Row>
                                    <Form.Group className="col-12 mb-3" controlId="formBasicEmail">
                                        <Form.Label className="text">Username</Form.Label>
                                        <Form.Control value={this.state.userDto.email} disabled name="farmaco" placeholder="Inserisci farmaco" />
                                    </Form.Group>
                                </Row>
                                <Row>
                                    <Form.Group className="col-6 mb-3" controlId="formBasicEmail">
                                        <Form.Label className="text">Nuova Password</Form.Label><Eye size='22' onClick={() => this.showPassword()} className='icon-black' />
                                        <Form.Control id="newPassword" alt="passwordModel" onChange={this.handleChange} name="newPassword" type='password' placeholder="Inserisci Dosagio" />
                                    </Form.Group>
                                    <Form.Group className="col-6 mb-3" controlId="formBasicEmail">
                                        <Form.Label className="text" >Conferma Password</Form.Label><Eye size='22' onClick={() => this.showConfirmPassword()} className='icon-black' />
                                        <Form.Control id="confirmPassword" alt="passwordModel" onChange={this.handleChange} name="confirmPassword" type='password' placeholder="Inserisci quantita" />
                                    </Form.Group>

                                    {validations.equalPass ? (
                                        <div className=" input-layout-wrapper text-danger">
                                            {' '}
                                            Le password devono coincidere{' '}
                                        </div>
                                    ) : <div className=" input-layout-wrapper text-danger is-12">
                                        {' '}{' '}
                                    </div>}
                                </Row>
                                <Row>
                                    <Form.Group className="col-12 mb-3" controlId="formBasicEmail">
                                        <Form.Label className="text">Codice Reset</Form.Label>
                                        <Form.Control id="resetPasswordCode" name="resetPasswordCode" alt="passwordModel" onChange={this.handleChange} placeholder="Inserisci farmaco" />
                                    </Form.Group>
                                </Row>
                            </Modal.Body>
                            <Modal.Footer>
                                <Button variant="secondary" onClick={() => this.handleCloseChangePassword()}>
                                    Chiudi
                                </Button>
                                <Button variant="secondary" onClick={() => this.sedRestCode()} > {this.state.isSending == true ? <Spinner
                                    as="span"
                                    animation="border"
                                    size="sm"
                                    role="status"
                                    aria-hidden="true"
                                /> : ''}Richiedi codice</Button>
                                <Button variant="primary" onClick={() => this.sendChangePassword()}>{this.state.isSending == true ? <Spinner
                                    as="span"
                                    animation="border"
                                    size="sm"
                                    role="status"
                                    aria-hidden="true"
                                /> : ''}Cambia Password</Button>
                            </Modal.Footer>
                            <ContainerModal />
                        </Modal>
                    </Container>
                    < NotificationContainer />
                </>

            }
        </>
        )
    }
}

export default DoctorProfile
