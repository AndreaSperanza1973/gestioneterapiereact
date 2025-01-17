import React, { Component } from 'react';
import { Container, Row, Table, Form, Button, Modal } from 'react-bootstrap';
import { user, medico, patient, caremanager } from '../helpers/api/api';
import { RowCustom } from "../Doctor/PatientComponent";
import Pagination from '../helpers/pagination';

export class ContactInfoPatient extends Component {
    contactInfoDtoProps = () => ({

        id: 0,
        dataOraContatto: "2022-04-24T14:00:15.110Z",
        pazienteContattato: true,
        info: "",
        idCareManager: 0,
        idPatient: 0

    })
    constructor(props) {
        super(props);
        this.state = {
            listPatientInfo: [],
            currentPage: 1,
            itemPerPage: 5,
            isOpenModal: false,
            isUpdate: false,
            contactInfoDto: { ...this.contactInfoDtoProps(), },
            patient: {}
        }

        this.GetListPatientInfo = this.GetListPatientInfo.bind(this);
        this.getPatient = this.getPatient.bind(this);
    }
    componentDidMount() {
        this.GetListPatientInfo();
        this.getPatient();
    }
    getPatient = () => {
        let id = window.location.pathname.split('/').pop();
        id = parseInt(id);
        patient.get("GET/", id)
            .then(async (response) => {
                if (response.status == 200) {
                    this.setState({ patient: response.data.dati });
                }
            }).catch((error) => {

            })
            .finally(() => {
            });
    }
    GetListPatientInfo = () => {
        let id = window.location.pathname.split('/').pop();
        id = parseInt(id);
        caremanager.get("ContactInfo/", id)
            .then(async (response) => {
                if (response.status == 200) {
                    this.setState({ listPatientInfo: response.data.dati });
                }
            }).catch((error) => {

            })
            .finally(() => {
            });
    }
    sedNote = () => {
        const  dto =this.state.contactInfoDto; 
        dto.idCareManager= JSON.parse(localStorage.getItem("role")).id ; 
        dto.idPatient= this.state.patient.id ; 
        caremanager.post("ContactInfo", this.state.contactInfoDto)
            .then(async (response) => {
                if (response.status == 200) {

                    this.GetListPatientInfo();
                }
            }).catch((error) => {

            })
            .finally(() => {
            });
    }
    handleChange = (el) => {
        const inputName = el.target.name;
        const inputValue = el.target.value;
        this.updateState(inputName, inputValue, 'contactInfoDto');
    };

    updateState = (inputName, inputValue, objName) => {
        const statusCopy = { ...this.state };
        statusCopy[objName][inputName] = inputValue;

        this.setState(statusCopy);
    };
    setCurrentPage = (n) => {
        this.setState({ currentPage: n });
    }
    render() {
        const indexOfLastPatient = this.state.currentPage * this.state.itemPerPage;
        const indexOfFirstPatient = indexOfLastPatient - this.state.itemPerPage;
        const currentItem = this.state.listPatientInfo.slice(indexOfFirstPatient, indexOfLastPatient);
        const doclist = this.state.patient.doctorNameIdDTOs ? this.state.patient.doctorNameIdDTOs.slice(indexOfFirstPatient, indexOfLastPatient) : [];
        const element = {};
        currentItem.map((pa) => { pa.openModal = 'openModal'; });
        return (
            <Container className="">
                <Row className='col-12 pt-4' >
                    <Row className='col-6 pt-4' >
                        <Table striped bordered hover size="sm">
                            <thead>
                                <tr>
                                    <th>Data </th>
                                    <th>Info</th>
                                </tr>
                            </thead>
                            <tbody>
                                {
                                    currentItem.map((pa) => <RowCustom colums={["dataOraContatto", "info"]} link={'codicePaziente'} reference={'codicePaziente'} controller={'ContactInfoPatient'} item={pa} />)
                                }
                            </tbody>
                        </Table>
                        <Pagination
                            patientsPerPage={3}
                            totalPatients={this.state.listPatientInfo.length}
                            paginate={(pageNumber) => this.setCurrentPage(pageNumber)}
                        />
                    </Row>
                    <Row className='col-6 pt-4' >
                        <Row className='col-12 pt-4' >
                            <Form.Group className="col-4 mb-3" controlId="formBasicEmail">
                                <Form.Label className="">CF Paziente</Form.Label>
                                <Form.Control disabled id='surName' value={this.state.patient.fiscalCode ? this.state.patient.fiscalCode : ''} alt='userDto' name="surName" placeholder="Enter cognome" />
                            </Form.Group>
                            <Form.Group className="col-4 mb-3" controlId="formBasicEmail">
                                <Form.Label className="">Telefono</Form.Label>
                                <Form.Control disabled id='name' value={this.state.patient.phoneNumber ? this.state.patient.phoneNumber : ''} alt='userDto' name="name" placeholder="Enter Nome" />
                            </Form.Group>
                            <Form.Group className="col-4 mb-3" controlId="formBasicEmail">
                                <Form.Label className="">Email</Form.Label>
                                <Form.Control disabled id='name' alt='userDto' name="name" value={this.state.patient.email ? this.state.patient.email : ''} placeholder="Enter Nome" />
                            </Form.Group>
                        </Row>
                        <Row className='col-12 pt-4 pl-4' >
                            <Table striped bordered hover size="sm">
                                <thead>
                                    <tr>
                                        <th>Nome Medico </th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {
                                        this.state.patient.doctorNameIdDTOs ? doclist.map((pa) => <RowCustom colums={["nameDoctor"]} item={pa} />) : ''
                                    }
                                </tbody>
                            </Table>
                        </Row>
                        <Row className='col-12 pt-4' >
                            <Form.Group className="mb-3" controlId="exampleForm.ControlTextarea1">
                                <Form.Label>Note</Form.Label>
                                <Form.Control as="textarea" id='info' alt='contactInfoDto' name='info' onChange={this.handleChange} rows={3} />
                            </Form.Group>
                        </Row>
                        <Row className='col-3 pt-4' >
                            <Button onClick={() => this.sedNote()}>Salva Info</Button>
                        </Row>
                    </Row>
                </Row>

            </Container>
        )
    }
}

export default ContactInfoPatient
